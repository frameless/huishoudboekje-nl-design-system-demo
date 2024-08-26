namespace Core.CommunicationModels;

public class Paged<T>
{
    public List<T> Data { get; set; } = null!;

    public int TotalCount { get; set; }

    public Paged()
    {
    }
    public Paged(List<T> data, int total)
    {
        this.Data = data;
        this.TotalCount = total;
    }
}
