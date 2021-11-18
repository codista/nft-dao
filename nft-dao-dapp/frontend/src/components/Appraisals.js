
import { VStack,Box,Text,Flex } from "@chakra-ui/react"
import Appraisal from "./Appraisal"
import {useState, useEffect} from "react"
import {ethers } from "ethers"
import { ERC721_ABI,ERC1155_ABI} from "./../contracts/conf"
import { ErrorDescription } from "@ethersproject/abi/lib/interface"

async function getAppraisals(contract) {
    let appraisals=null;
    if (contract!==null)
        appraisals = await contract.getUserAppraisalRequests();
    //console.log(appraisals);    
    return appraisals
}

async function addApprNFTData(apprsFromBC,provid)
{
    if (apprsFromBC===null || provid===null) {console.log("got empty appraisals or provider to fetch nft data");return null;}
    
    for(var i=0;i<apprsFromBC.length;i++)
    {
        const NFTCont = new ethers.Contract(apprsFromBC[i][2], ERC721_ABI, provid.getSigner());
        if (NFTCont!==null) {

            let url="";
            
            try{
                url= await NFTCont.tokenURI(apprsFromBC[i][1]);
            } catch(err){
                console.error(`got error in tokenURI fetch now trying erc1155`,err)
                const NFTCont1155 = new ethers.Contract(apprsFromBC[i][2], ERC1155_ABI, provid.getSigner());
                try {
                    url= await NFTCont1155.uri(apprsFromBC[i][1]);
                } catch(err) {console.error(`got error also in urierc1155`,err)}
            
            
            }
            if (url){
                let res = await fetch(url,{headers: new Headers({
                    'Accept': 'application/json', 
                    })});
                if (res.status=="200")
                {
                    let jsn = await res.json();
                    console.log("client received nft META data: "+jsn);
                    apprsFromBC[i][9] = jsn.image;
                    apprsFromBC[i][10] = jsn.name;
                }  
                else {console.error("get error from metadata url fetch: ",res.status)}
            }
            
        }
    }
    /*for(var i=0;i<apprsFromBC.length;i++)
    {
        let res;
        try {
            let url="http://localhost:3000/nft/data/0x495f947276749Ce646f68AC8c248420045cb7b5e/85364157633350634373635596396121761067444146987595609300037457877546840358913"
            //let url=  "http://localhost:3000/nft/data/"+apprsFromBC[i][2]+"/"+apprsFromBC[i][1]+"/";
            res = await fetch(url,{headers: new Headers({
            'Accept': 'application/json', 
            })});
            if (res.status=="200")
            {
                let jsn = await res.json();
                console.log("client received nft data: "+jsn);
                apprsFromBC[i][9]=jsn;
            }  
            else {
                console.error(`fetching nft data returned error ${res.status} `)
            }
        } catch(error) {
            console.error(`fetching nft data returned error ${error.message} `)
        } 
    }*/
    return apprsFromBC;
}

const Appraisals = ({connected,cont,prov}) => {

    const [userApprs,setUserApprs] = useState(null);

    useEffect(() => {
        const getApprs = async (contract,provid) => {
            const apprsFromBC = await getAppraisals(contract);
            const apprsWithNFT = await addApprNFTData(apprsFromBC,provid);
            setUserApprs(apprsWithNFT);
        }
        getApprs(cont,prov);
    })

    return (
            <Box>
                {(userApprs!==null)?
                    userApprs.map((appr) => (<Appraisal data={appr} />))
                :
                    <Text>Please Connect Metamask to get started</Text>}
            </Box>
        
    )
}

export default Appraisals
