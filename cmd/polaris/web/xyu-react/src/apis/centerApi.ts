import HttpReq, {GqlReq} from "@/utils/req/request";
import {gql} from "apollo-boost";


export const detailsApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/details-list/query")
        .withBody(null)
        .withDataType("json")
        .axiosFun();
}

export const mapDataApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/map-data/query")
        .withBody(null)
        .withDataType("json")
        .axiosFun();
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