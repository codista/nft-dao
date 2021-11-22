import { Spinner,Box,Text } from "@chakra-ui/react"
import Appraisal from "./Appraisal"
import {useState, useEffect} from "react"
import AddAppraisal from "./AddAppraisal"
import {ETH_PRECISION} from "./../contracts/conf"
import {BigNumber} from "ethers"
import JoinDaoButton from "./JoinDaoButton"
import {addApprNFTData} from "./helpers"

async function getVoterApprs(contract,provid)
{    
    let scr=0;
    let apprs=null;
    let voterStatus=0;
    try {
        let userAddress = await provid.getSigner().getAddress();
        voterStatus = await contract.getExpertStatus(userAddress);
        
        
        if (voterStatus!=2) return {status:voterStatus,apprs:apprs,score:scr}
        scr = await contract.getExpertSCore(userAddress);
        if (scr!==false && scr!==undefined && typeof(scr)==BigNumber)
        {
            scr=scr.toNumber();
        }
        else {
            scr=0;
        }
        apprs = await contract.getAppraisalsForExpert();
        
        if (apprs===null || apprs.length==0) {
            return {status:voterStatus,apprs:apprs,score:scr};
        }
        //console.log("apprs before: "+JSON.stringify(apprs));
        let apprsWithData = await addApprNFTData(apprs,provid);
        //console.log("apprs after: "+JSON.stringify(apprsWithData));

       
        
        
        return {status:voterStatus,apprs:apprsWithData,score:scr}
        

    } catch(err){
        console.log("error in get voter apprs",err.message);
        return {status:voterStatus,apprs:apprs,score:scr};
    }

    
    
    
}

const AppraisalVotes = ({connected,cont,prov}) => {


    async function joinDao() {
       if (cont===null) {alert("Not Connected");return;}
       setFetchingVoteApprs(true);
       let stat=0;
       try{
            let tx = await cont.JoinDao({gasLimit:350000});
            let rec = await tx.wait(1);
            let userAddress = await prov.getSigner().getAddress();
            stat = await cont.getExpertStatus(userAddress);
       } catch(err) {
           console.log("failed to join dao",err.message);
           alert("Failed to join DAO");
           setFetchingVoteApprs(false);
           return;
       }
       setFetchingVoteApprs(false);
       setVoterStatus(stat);
    }

    const [voteApprs,setVoteApprs] = useState(null);
    const [voterStatus,setVoterStatus] = useState(0);
    const [fetchingVoteApprs,setFetchingVoteApprs] = useState(false);
    const [score,setScore]=useState(0);

    useEffect(() => {
        const getVoteApprs = async (contract,provid) => {
            if (contract!==null) {
                setFetchingVoteApprs(true);
                const results = await getVoterApprs(contract,provid);
                console.log("results include apprs: "+JSON.stringify(results.apprs));
                setFetchingVoteApprs(false);
                setVoteApprs(results.apprs);
                setVoterStatus(results.status);
                setScore(results.score);
            }
        }
        getVoteApprs(cont,prov);
    },[cont,prov])


    return (
        <Box>
                {fetchingVoteApprs ? <Spinner size="xl" />: 
                    <Box>
                    {connected===""?<Text>Please Connect Metamask to get started</Text>:''}
                    {connected!=="" && (voteApprs===null || voteApprs.length==0) && voterStatus==2?<Box><Text>Approved Expert! NFT Expert Score: {score} (scale of 1-10000)</Text><br /><Text>Sorry, currently there are no open appraisal requests for your score. Please check back later.</Text></Box>:''}
                    {(connected!=="" &&  voterStatus==0)?<JoinDaoButton joinDaoFunc={joinDao}  status={voterStatus}/>:''}
                    {(connected!=="" &&  voterStatus==1)?<Box><Text>Your NFT Expert Score is being processed. Please chech back later or refresh this page. If this is taking longer than a few minutes try resending with the button below.</Text><JoinDaoButton joinDaoFunc={joinDao}  status={voterStatus}/></Box>:''}
                    {(connected!=="" && voteApprs && voteApprs.length>0 && voterStatus==2)?<Text>Appraisal Requests You Can Vote On</Text>:''}
                    {(connected!=="" && voteApprs && voteApprs.length>0 && voterStatus==2)?(voteApprs.map((appr) => (<Appraisal data={appr} type="Voter" cont={cont} prov={prov}  id={appr.appraisal_id} key={appr.appraisal_id}/>))):''}
                    </Box>
                }    
        </Box>
    )
}

export default AppraisalVotes
