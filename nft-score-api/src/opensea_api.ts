const querystring = require("querystring");
const { curly } = require("node-libcurl");
//import Curl from "node-libcurl";
//import * as querystring from "querystring";

const OPENSEA_BASE_URL_RINKEBY = "https://rinkeby-api.opensea.io/api/v1/";
const OPENSEA_BASE_URL_MAINNET = "https://api.opensea.io/api/v1/";

export type Networks = 'rinkeby'|'mainnet';

export async function openseaApiGet(network: Networks, service: string,params: Object ): Promise<Object | false> {
    //const curlOpensea = new Curl();
    let baseURL = (network=='rinkeby')?OPENSEA_BASE_URL_RINKEBY:(network=='mainnet')?OPENSEA_BASE_URL_MAINNET:'';
    if (baseURL=='') {
        console.error('unsupported network in opensea_api');
        return false;
    }
    let url = baseURL+service;
    let queryString = querystring.stringify(params);
    url=url+"/?"+queryString;
    const { statusCode, data, headers } = await curly.get(url, {
        //postFields: JSON.stringify(params),
        httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json',
            /*'x-api-key: apiKey', */
        ],
        })
    //console.log(statusCode+" "+JSON.stringify(data)+" "+url);
    if (statusCode!=200) {
        console.error("failed to retrieve info from opensea api "+network,statusCode);
        return false;
    }
    return data;                    
                      
}