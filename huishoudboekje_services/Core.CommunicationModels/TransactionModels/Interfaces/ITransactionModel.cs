﻿namespace Core.CommunicationModels.TransactionModels.Interfaces;

public interface ITransactionModel
{
  public string UUID { get; }
  public int Amount { get; }
  public bool IsCredit { get; }
  public string FromAccount { get; }
  public long Date { get; }

  public string StatementLine { get; }

  public string InformationToAccountOwner { get; }

  public bool IsRecorded { get; }

  public string CustomerStatementMessageUUID { get; }
}