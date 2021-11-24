
import { Box,Text,Spinner,Button } from "@chakra-ui/react"
import Appraisal from "./Appraisal"
import {useState, useEffect} from "react"
import AddAppraisal from "./AddAppraisal"
import {ETH_PRECISION} from "./../contracts/conf"
import {BigNumber} from "ethers"
import {addApprNFTData} from "./helpers"

async function getAppraisals(contract,provid) {
    let appraisals=null;
    if (contract!==null)
        appraisals = await contract.getUserAppraisalRequests();
    //console.log("get appraisals is called from comp and gets these: "+appraisals);    
    let apprsWithData = await addApprNFTData(appraisals,provid);
    if (apprsWithData===null)
        return appraisals;
    else    
        return apprsWithData;
}





const Appraisals = ({connected,cont,prov}) => {

    const [userApprs,setUserApprs] = useState(null);
    const [fetchingApprs,setFetchingApprs] = useState(false);
    const [showAddAppr,setShowAddAppr] = useState(false);

    useEffect(() => {
        const getApprs = async (cont,prov) => {
            if (cont!==null) {
                setFetchingApprs(true);
                const apprsFromBC = await getAppraisals(cont,prov);
                setFetchingApprs(false);
                setUserApprs(apprsFromBC);
            }
        }
        getApprs(cont,prov);
    },[cont,prov])

    function floatSTRToBGWei(fl) {
        let flPerc = Math.round(Number(fl)*(10 ** ETH_PRECISION));
        let BGWei = BigNumber.from(flPerc);
        return BGWei.mul(10 ** (18-ETH_PRECISION));
    }

    async function AddAppraisalF(appr) {
        //alert("here "+JSON.stringify(appr));
        if (cont===undefined || cont===null) {alert("could not add appraisal request. Pleasse make sure your wallet is connected");return;}
        
        try {
            let tx = await cont.SubmitNFTForAppraisal(appr.nftContract,
            appr.NFTId,
            appr.NFTMarketplace,
              appr.minVoters,
              appr.minExpertLevel,{value:floatSTRToBGWei(appr.payout)});
            let receipt = tx.wait(1);
        } catch(error){
            alert("failed to submit appraisal");
            return;
        }   
        let appraisals = await getAppraisals(cont,prov);
        setUserApprs(appraisals);

    }
    function toggleShowButton() {
        setShowAddAppr(!showAddAppr);
    }

    return (
            <Box>
                {fetchingApprs ? <Spinner size="xl" />: 
                    <Box>
                    {connected===""?<Text>Please Connect Metamask to get started</Text>:''}
                    {connected!=="" && (userApprs===null || userApprs.length==0)?<Text>You Haven't submitted any appraisal requests yet, please use the form below to add one.</Text>:''}
                    {(connected!=="" )?<Button m={7} colorScheme="blue" onClick={toggleShowButton}>{showAddAppr?'Hide':'Add a New Appraisal Request'}</Button>:''}
                    {(connected!=="" && showAddAppr)?<AddAppraisal AddAppraisalFunc={AddAppraisalF}/>:''}
                    {(connected!=="" && userApprs && userApprs.length>0)?<Text>Your Existing NFT Appraisal Requests</Text>:''}
                    {(connected!=="" && userApprs && userApprs.length>0)?(userApprs.map((appr) => (<Appraisal data={appr} type="User" id={appr.appraisal_id} cont={cont} prov={prov} key={appr.appraisal_id}/>))):''}
                    </Box>
                }    
            </Box>
        
    )
}

export default Appraisals
