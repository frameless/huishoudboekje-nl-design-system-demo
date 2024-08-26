namespace FileServices.Logic.Services.Interfaces;

internal interface ICommandHandler<in TCommand> where TCommand : ICommand
{
  Task HandleAsync(TCommand command);
}
