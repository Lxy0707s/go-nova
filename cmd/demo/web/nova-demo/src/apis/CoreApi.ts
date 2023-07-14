import HttpReq, {GqlReq} from "@/utils/req/request";
import {gql} from "apollo-boost";


export const detailsApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/v1/details")
        .withBody(null)
        .withDataType("json")
        .reqFun();
}

export const userDataApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/v1/user-list")
        .withBody(null)
        .withDataType("json")
        .reqFun();
}

export const galApi = (params: any) => {
    const query = gql`
        query($organization: String!) {
            organization(login: $organization) {
                name
                url
                repositories(first: 5) {
                    edges {
                        node {
                            name
                            url
                        }
                    }
                }
            }
        }
    `
    const client = new GqlReq().gqlClient()
    return client.query({
        query: query,
        variables: {
            ...params,
        },
    })
        .then(console.log)
        .catch(()=>{
            console.log("gql-err:",query)
        });
}