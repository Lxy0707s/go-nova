import ApolloClient   from 'apollo-boost';

export const newGqlClient = (authorization: string) => {
    return new ApolloClient({
        uri: 'https://api.github.com/graphql',
        request: operation => {
            if (authorization !== ""){
                operation.setContext({
                    headers: {
                        authorization: `Bearer ${authorization}`,
                    },
                });
            }
        },
    })
}
