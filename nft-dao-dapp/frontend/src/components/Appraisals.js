
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

async function addApprNFTData(apprsFromBC);
{
    for(var i=0;i<apprsFromBC.length;i++)
    {
        
    }
}

const Appraisals = ({connected,cont}) => {

    const [userApprs,setUserApprs] = useState(null);

    useEffect(() => {
        const getApprs = async (contract) => {
            const apprsFromBC = await getAppraisals(contract);
            const apprsWithNFT = await addApprNFTData(apprsFromBC);
            setUserApprs(apprsFromBC);
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
