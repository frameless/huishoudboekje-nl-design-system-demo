namespace Core.CommunicationModels;

public class Pagination
{
    public int Take { get; private set; }

    public int Skip { get; private set; }

    public Pagination(int take, int skip)
    {
        this.Take = take;
        this.Skip = skip;
    }
}
