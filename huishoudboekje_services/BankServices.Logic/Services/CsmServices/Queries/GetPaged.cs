﻿using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Logic.Services.CsmServices.Queries;

internal record GetPaged(Pagination Pagination) : IQuery<Paged<ICsm>>;
