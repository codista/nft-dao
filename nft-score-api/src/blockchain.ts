import {ethers} from "ethers"
const { curly } = require("node-libcurl");
import * as dotenv from "dotenv";
import { NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI} from "./conf";

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


export async function updateScores() {
    console.log('updating scores');
    let alchemy_provider = new ethers.providers.AlchemyProvider("rinkeby","F0RnL2GBIPe43J0E_nIWuiOKpQYR6xBP");
    let signer = new ethers.Wallet(process.env.SIGNER as string,alchemy_provider);
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, signer);
    try {
        let tx = await expertApprCont.updateExpertScores({gasLimit:500000});
        let rec = await tx.wait(1);
    } catch(error){
        console.error(error);
        return false;
    }
    return true;
}


export async function updateExpirations() {
    console.log('updating expirations');
    let alchemy_provider = new ethers.providers.AlchemyProvider("rinkeby","F0RnL2GBIPe43J0E_nIWuiOKpQYR6xBP");
    let signer = new ethers.Wallet(process.env.SIGNER as string,alchemy_provider);
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, signer);
    try {
        let tx = await expertApprCont.updateExpertScores({gasLimit:500000});
        let rec = await tx.wait(1);
    } catch(error){
        console.error(error);
        return false;   
    }
    return true;
}