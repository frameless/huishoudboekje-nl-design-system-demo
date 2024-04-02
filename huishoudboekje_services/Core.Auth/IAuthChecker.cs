namespace Core.Auth;

public interface IAuthChecker<T>
{
    bool IsUserAllowedAccess(T credentials);
}