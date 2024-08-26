using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Queries;

internal record UploadCsm(IHhbFile FileUpload) : IQuery<IHhbFile>;
