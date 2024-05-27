using Core.ErrorHandling.Exceptions;
using FakeItEasy;
using Microsoft.Extensions.Configuration;
using UserApi.Domain.repositories.interfaces;
using UserApi.Services.AuthServices;

namespace UserApi.Tests.Services;

public class AuthServicesTests
{
  private IConfiguration _fakeConfiguration;
  private ITokenRepository _fakeTokenRepository;
  private ISecretGenerator _fakeSecretGenerator;
  private AuthService _sut;

  [SetUp]
  public void Setup()
  {
    _fakeConfiguration = A.Fake<IConfiguration>();
    _fakeTokenRepository = A.Fake<ITokenRepository>();
    _fakeSecretGenerator = A.Fake<ISecretGenerator>();
    _sut = new AuthService(_fakeConfiguration, _fakeTokenRepository, _fakeSecretGenerator);
  }

  [Test]
  public void WhenNoKeyGenerateNewTokenErrors()
  {
    // Arrange
    string? ip = "123456789";
    string? key = null;

    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public void WhenNoIpGenerateNewTokenErrors()
  {
    //Arrange
    string? ip = null;
    string? key = "testapikeyfortesting";

    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public void WhenMissingRegisteredKeysEnvGenerateTokenErrors()
  {
    // Arrange
    string? ip = "123456789";
    string? key = "testapikeyfortesting";
    A.CallTo(() => _fakeConfiguration["HHB_API_KEYS"]).Returns(null);

    // Act & Assert
    Assert.ThrowsAsync<HHBMissingEnvironmentVariableException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public void WhenNoRegisteredKeysGenerateTokenErrors()
  {
    // Arrange
    string? ip = "123456789";
    string? key = "testapikeyfortesting";
    A.CallTo(() => _fakeConfiguration["HHB_API_KEYS"]).Returns("");

    // Act & Assert
    Assert.ThrowsAsync<HHBAuthorizationException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public void WhenNotRegisteredKeyProvidedGenerateTokenErrors()
  {
    // Arrange
    string? ip = "123456789";
    string? key = "testapikeyfortesting";
    string keys = "iaheghagiuhawerguiweg";
    A.CallTo(() => _fakeConfiguration["HHB_API_KEYS"]).Returns(keys);

    // Act & Assert
    Assert.ThrowsAsync<HHBAuthorizationException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public void WhenNotRegisteredKeyProvidedMultiplePossibleKeysGenerateTokenErrors()
  {
    // Arrange
    string? ip = "123456789";
    string? key = "testapikeyfortesting";
    string keys = "iaheghagiuhawerguiweg;agefliaefliawhg;aefhyuaweofhagweogh";
    A.CallTo(() => _fakeConfiguration["HHB_API_KEYS"]).Returns(keys);

    // Act & Assert
    Assert.ThrowsAsync<HHBAuthorizationException>(async () => await _sut.GenerateNewToken(ip, key));
  }

  [Test]
  public async Task WhenRegisteredKeyProvidedMultiplePossibleKeysGenerateTokenReturnsAndStoresValidToken()
  {
    // Arrange
    const string? ip = "123456789";
    const string? key = "testapikeyfortesting";
    const string keys = "testapikeyfortesting;agefliaefliawhg;aefhyuaweofhagweogh";
    const string expectedToken = "1018acf9ea83064f82b813f4f58625af422084cd2e759e2032f41e2799c863a8";
    A.CallTo(() => _fakeConfiguration["HHB_API_KEYS"]).Returns(keys);
    A.CallTo(() => _fakeSecretGenerator.GenerateSecret()).Returns("secretstring");

    // Act
    string result = await _sut.GenerateNewToken(ip, key);

    // Assert
    A.CallTo(() =>
        _fakeTokenRepository.InsertToken(A<string>.That.Matches(input => input.Equals(result)), A<string>.Ignored))
      .MustHaveHappenedOnceExactly();
    Assert.That(result, Is.EqualTo(expectedToken));
  }

  [Test]
  public async Task WhenInvalidTokenValidateTokenErrors()
  {
    // Arrange
    const string token = "testapikeyfortesting";
    const string? ip = "123456789";
    A.CallTo(() => _fakeTokenRepository.GetTokenSecret(A<string>.Ignored)).Returns(Task.FromResult<string?>(null));

    // Act & Assert
    Assert.ThrowsAsync<HHBAuthorizationException>(async () => await _sut.ValidateToken(token, ip));
  }

  [Test]
  public async Task WhenValidTokenNoIpValidateTokenErrors()
  {
    // Arrange
    const string token = "testapikeyfortesting";
    const string secret = "secret";
    const string? ip = null;
    A.CallTo(() => _fakeTokenRepository.GetTokenSecret(A<string>.Ignored)).Returns(Task.FromResult<string?>(secret));

    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.ValidateToken(token, ip));
  }

  [Test]
  public async Task WhenValidTokenValidateTokenReturnsTrue()
  {
    // Arrange
    const string token = "1018acf9ea83064f82b813f4f58625af422084cd2e759e2032f41e2799c863a8";
    const string secret = "secretstring";
    const string? ip = "123456789";
    A.CallTo(() => _fakeTokenRepository.GetTokenSecret(A<string>.Ignored)).Returns(Task.FromResult<string?>(secret));

    // Act
    bool result = await _sut.ValidateToken(token, ip);

    // Assert
    Assert.That(result, Is.True);
  }
}
