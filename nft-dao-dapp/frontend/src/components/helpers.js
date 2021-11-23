import * as dotenv from "dotenv";
dotenv.config();

function copyApprData(obj)
{
    var ret = {
        appraisal_id: obj.appraisal_id,
        nft_id: obj.nft_id,
        nft_contract: obj.nft_contract,
        status: obj.status,
        request_time: obj.request_time,
        minVoters: obj.minVoters,
        minExpertiseLevel: obj.minExpertiseLevel,
        paymentEth: obj.paymentEth,
        nftMarketplace: obj.nftMarketplace,
        nft_data: {}
    }
    return ret;
    
}

export async function addApprNFTData(apprsFromBC,provid)
{
    console.log("add nft data starts with these: "+apprsFromBC);    
    var returnData = [];
    if (apprsFromBC===null || provid===null) {console.log("got empty appraisals or provider to fetch nft data");return null;}
    
   
    
    for(var i=0;i<apprsFromBC.length;i++)
    {
        let res;
        try {
            let url=  process.env.API_URL+"/nft/data/"+apprsFromBC.nft_contract+"/"+apprsFromBC.nft_id+"/";
            res = await fetch(url,{headers: new Headers({
            'Accept': 'application/json', 
            })});
            if (res.status=="200")
            {
                let jsn = await res.json();
                console.log("client received nft data: "+JSON.stringify(jsn));
                returnData[i] = copyApprData(apprsFromBC[i]);
                returnData[i].nft_data=jsn;
            }  
            else {
                console.error(`fetching nft data returned error ${res.status} `)
            }
        } catch(error) {
            console.error(`fetching nft data returned error ${error.message} `)
        } 
    }
    console.log("add nft data about to return: "+returnData); 
    return returnData;
}