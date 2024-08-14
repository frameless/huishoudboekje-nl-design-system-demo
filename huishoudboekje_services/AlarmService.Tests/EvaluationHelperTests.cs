using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Helpers;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using FakeItEasy;

namespace AlarmService.Tests;

public class EvaluationHelperTests
{
  private EvaluationHelper _sut;
  private DateTimeProvider dateTimeProvider;
  [SetUp]
  public void Setup()
  {
    dateTimeProvider = new DateTimeProvider();
    _sut = new EvaluationHelper(new DateTimeProvider());
  }

}
