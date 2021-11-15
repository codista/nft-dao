import type {Contract} from "ethers";
import  { DecentralizedNFTDao } from "../typechain";

export async function submitAppraisal(cont: DecentralizedNFTDao,
                                        nftid: string,
                                        nftcont: string,
                                        nfturl: string,
                                        minVoters: number,
                                        minScore: number,
                                        gaspriceWei:  number,
                                        paymentWei: number){
    let res = await cont.SubmitNFTForAppraisal(nftcont,
        nftid,
        nfturl,
        minVoters,
        minScore,
      {gasLimit:350000,gasPrice:gaspriceWei,value:paymentWei});
    let ret = await res.wait(1);
}

export async function joinDao(cont: DecentralizedNFTDao,gaspriceWei:  number){
    let receipt = await cont.JoinDao({gasLimit:350000,gasPrice:gaspriceWei});
    let ret = await receipt.wait(1);
}

export async function waitForChainlinkScore(cont: DecentralizedNFTDao,address: string)
{
    let ret: number | false=false;
    let status=await cont.getExpertStatus(address);
    while (status==0 || status==1 ) { //not started or waiting
        status=await cont.getExpertStatus(address);
        console.log("chainlink response status is "+status);
    }
    if (status==2){
        let retBig = await cont.getExpertSCore(address);
        ret=retBig.toNumber();
    }
    return ret;
}

export async function vote(cont: DecentralizedNFTDao, appr_id:number, appraisal_amount: number) {
    let receipt = await cont.SubmitAppraisalVote(appr_id,appraisal_amount);
    let res = await receipt.wait(1);
}