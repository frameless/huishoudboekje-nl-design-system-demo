using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Commands;

public record ParseCsm(IHhbFile csmFile) : ICommand;
