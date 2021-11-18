
import { VStack,Box,Text,Flex } from "@chakra-ui/react"
import Appraisal from "./Appraisal"
import {useState, useEffect} from "react"

async function getAppraisals(contract) {
    let appraisals=null;
    if (contract!==null)
        appraisals = await contract.getUserAppraisalRequests();
    console.log(appraisals);    
    return appraisals
}

async function addApprNFTData(apprsFromBC)
{
    if (apprsFromBC===null) return null;
    for(var i=0;i<apprsFromBC.length;i++)
    {
        let res = await fetch("http://localhost:3000/nft/data/"+apprsFromBC[i][2]+"/"+apprsFromBC[i][1]+"/",{headers: new Headers({
            'Accept': 'application/json', 
          })});
        let jsn = await res.json();
        console.log(jsn);
    }
    return apprsFromBC;
}

const Appraisals = ({connected,cont}) => {

    const [userApprs,setUserApprs] = useState(null);

    useEffect(() => {
        const getApprs = async (contract) => {
            const apprsFromBC = await getAppraisals(contract);
            const apprsWithNFT = await addApprNFTData(apprsFromBC);
            setUserApprs(apprsWithNFT);
        }
        getApprs(cont);
    },[cont])

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
