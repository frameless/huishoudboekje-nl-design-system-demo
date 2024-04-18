namespace Core.CommunicationModels;

public class Paged<T>
{
    public List<T> Data { get; private set; }

    public int TotalCount { get; private set; }

    public Paged(List<T> data, int total)
    {
        this.Data = data;
        this.TotalCount = total;
    }
}
