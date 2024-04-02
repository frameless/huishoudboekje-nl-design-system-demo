using Grpc.Core;

namespace Core.utils.Helpers;

public class MetadataHelper
{
    public static string? GetCookieFromMetadata(Metadata meta, string metaDataKey, string cookieKey)
    {
        foreach (var item in meta)
        {
            if (item.Key == metaDataKey)
            {
                foreach (var value in item.Value.Split(";"))
                {
                    string[] cookie = value.Split("=");
                    if (cookie[0].Trim() == cookieKey)
                    {
                        return cookie[1];
                    }
                }
            }
        }

        return null;
    }
}
