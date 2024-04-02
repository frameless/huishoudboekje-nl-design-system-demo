using System.Text.Json;
using System.Text.Json.Serialization;

namespace Core.utils.JsonConverters;

/*
There are ids in the database that are stored as a number but have to be returned as a string.
JsonNumberHandling.AllowReadingFromString does not work unless old data is converted in the database

source: https://stackoverflow.com/questions/59097784/system-text-json-deserialize-json-with-automatic-casting
*/


public class NumberToStringJsonConverter : JsonConverter<object>
{
    public override bool CanConvert(Type typeToConvert)
    {
        return typeof(string) == typeToConvert;
    }

    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType switch
        {
            JsonTokenType.Number => NumberType(ref reader),
            JsonTokenType.String => StringType(ref reader),
            _ => Default(ref reader)
        };
    }

    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString());
    }

    private object NumberType(ref Utf8JsonReader reader)
    {
        return reader.TryGetInt64(out var l) ? l.ToString() : reader.GetDouble().ToString();
    }

    private object? StringType(ref Utf8JsonReader reader)
    {
        return reader.GetString();
    }

    private object Default(ref Utf8JsonReader reader)
    {
        using var document = JsonDocument.ParseValue(ref reader);
        return document.RootElement.Clone().ToString();
    }
}
