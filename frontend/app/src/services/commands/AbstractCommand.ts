import {ApolloClient, NormalizedCacheObject, useApolloClient} from "@apollo/client"

/* 
These commands are used for refetching specific queries that are not the result of a mutation directly
An example where this happens is signal counts, which is the indirect result of reconciliation,
but the mutation ends after uploading a file -> refetching directly would be too fast
*/
export abstract class Command<T> {
    private _client: ApolloClient<object> = useApolloClient()

    abstract execute(variables?: T): void

    RefetchQuery(queryName: string, variables?: T): void {
        this._client.refetchQueries({
            include: [queryName]
        })
    }
}


