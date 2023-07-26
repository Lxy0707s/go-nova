import ApolloClient   from 'apollo-boost';

export const newGqlClient = (authorization: string) => {
    return new ApolloClient({
        uri: 'http://localhost:8089/query',
        // request: operation => {
        //     if (authorization !== ""){
        //         operation.setContext({
        //             headers: {
        //                 authorization: `Bearer ${authorization}`,
        //             },
        //         });
        //     }
        // },
    })
}
