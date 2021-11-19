
import { VStack,Box,Text,Flex,Heading } from "@chakra-ui/react"
import Appraisal from "./Appraisal"
import {useState, useEffect} from "react"
import AddAppraisal from "./AddAppraisal"

async function getAppraisals(contract) {
    let appraisals=null;
    if (contract!==null)
        appraisals = await contract.getUserAppraisalRequests();
    console.log("get appraisals is called from comp and gets these: "+appraisals);    
    return appraisals
}

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

async function addApprNFTData(apprsFromBC,provid)
{
    console.log("add nft data starts with these: "+apprsFromBC);    
    var returnData = [];
    if (apprsFromBC===null || provid===null) {console.log("got empty appraisals or provider to fetch nft data");return null;}
    
   
    
    for(var i=0;i<apprsFromBC.length;i++)
    {
        let res;
        try {
            //let url="http://localhost:3000/nft/data/0x8cd8155e1af6ad31dd9eec2ced37e04145acfcb3/1808"
            let url=  "http://localhost:3000/nft/data/"+apprsFromBC[i][2]+"/"+apprsFromBC[i][1]+"/";
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

const Appraisals = ({connected,cont,prov}) => {

    const [userApprs,setUserApprs] = useState(null);

    useEffect(() => {
        const getApprs = async (contract,provid) => {
            const apprsFromBC = await getAppraisals(contract);
            const apprsWithNFT = await addApprNFTData(apprsFromBC,provid);
            console.log("add nft data returned: "+apprsWithNFT); 
            setUserApprs(apprsWithNFT);
        }
        getApprs(cont,prov);
    },[cont,prov])

    function AddAppraisalF(appr) {
        alert("here "+JSON.stringify(appr));
    }

    return (
            <Box>
                
                
                <Heading>{(connected!=="" && userApprs!==null && userApprs.length>0)?'Here Are Your Appraisales':(connected!=="")?'You Haven\'t submitted any appraisal requests yet, please use the form below to add one.':'Please Connect Metamask to get started'}</Heading>
                {(connected!=="")?<AddAppraisal AddAppraisalFunc={AddAppraisalF}/>:''}
                {(userApprs && userApprs.length>0)?(userApprs.map((appr) => (<Appraisal data={appr} id={appr.appraisal_id} key={appr.appraisal_id}/>))):''}
                
        
            </Box>
        
    )
}

export default Appraisals
