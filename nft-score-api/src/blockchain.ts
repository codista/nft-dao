import {ethers} from "ethers"
const { curly } = require("node-libcurl");
import * as dotenv from "dotenv";
dotenv.config();

export async function getNftData(contract: string, id: string)
{
    
}

export async function getNftPortData(contract: string, id: string)
{
    let url="https://api.nftport.xyz/v0/nfts/"+contract+"/"+id+"?chain=ethereum";
    let autHeader = 'Authorization: '+process.env.NFTPORT_API_KEY;
    console.log("before nftport call auth header is "+autHeader);
    const { statusCode, data, headers } = await curly.get(url, {
        httpHeader: [
            
            'Accept: application/json',
            autHeader
        ],
        })
    console.log("NFTPort response: "+statusCode+" "+JSON.stringify(data)+" "+url);
    if (statusCode!=200) {
        console.error(`failed to retrieve inft info from nftport for url ${url} `,statusCode);
        return false;
    }
    console.log("received data from nftport is : "+data)
    return data;

}
