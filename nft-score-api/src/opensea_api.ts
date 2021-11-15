const querystring = require("querystring");
const { curly } = require("node-libcurl");
//import Curl from "node-libcurl";
//import * as querystring from "querystring";

const OPENSEA_BASE_URL = "https://rinkeby-api.opensea.io/api/v1/";
//const OPENSEA_BASE_URL = "https://api.opensea.io/api/v1/";

export async function openseaApiGet(service: string,params: Object ): Promise<Object | false> {
    //const curlOpensea = new Curl();
    let url = OPENSEA_BASE_URL+service;
    let queryString = querystring.stringify(params);
    url=url+"/?"+queryString;
    const { statusCode, data, headers } = await curly.get(url, {
        //postFields: JSON.stringify(params),
        httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        })
    //console.log(statusCode+" "+JSON.stringify(data)+" "+url);
    if (statusCode!=200) {
        console.error("failed to retrieve info from opensea api ",statusCode);
        return false;
    }
    return data;                    
                      
}