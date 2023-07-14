import HttpReq, {GqlReq} from "@/utils/req/request";
import {gql} from "apollo-boost";
import {ContentType} from "@/utils/req/rest.fun";


export const detailsApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/v1/details")
        .withBody(null)
        .withDataType("json")
        .reqFun();
}

export const userDataApi = () => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/v1/user")
        .withHeader({
            'Content-Type': ContentType.json,
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
        })
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