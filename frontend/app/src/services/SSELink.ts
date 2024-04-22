import {
    ApolloLink,
    Operation,
    FetchResult,
    Observable,
} from '@apollo/client/core';
import {print, GraphQLError} from 'graphql';
import {createClient, ClientOptions, Client} from 'graphql-sse';


const GetCurrentLocation = () => {
    const hostname = window.location.hostname;
    if (hostname === "localhost") {
        return `${window.location.protocol}//${hostname}:${window.location.port}`
    }
    else {
        return `${window.location.protocol}//${hostname}`
    }
}


export class SSELink extends ApolloLink {
    private client: Client;

    constructor(graphqlPath: string) {
        super();
        const url = GetCurrentLocation() + graphqlPath;
        this.client = createClient({
            url: url
        });
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) => {
            return this.client.subscribe<FetchResult>(
                {...operation, query: print(operation.query)},
                {
                    next: sink.next.bind(sink),
                    complete: sink.complete.bind(sink),
                    error: sink.error.bind(sink),
                },
            );
        });
    }
}