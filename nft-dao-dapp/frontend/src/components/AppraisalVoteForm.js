import { Spinner,Box,Text } from "@chakra-ui/react"
    import {useState,useEffect} from "react";

    import AppraisalVoteFormInner from "./AppraisalVoteFormInner"


async function initVote(contr,provi,apprID) {
    let addr = await provi.getSigner().getAddress();
    let vote = await contr.getExpertVote(apprID,addr);
    return vote.toNumber();
}    

const AppraisalVoteForm = ({apprID, cont,prov}) => {

    const  onSubmitVote = async (values) => {
        setFetching(true);
        let tx = await cont.SubmitAppraisalVote(apprID,values.appraisalUSD);
        let rec = await tx.wait(1);
        const vote = await initVote(cont,prov,apprID);
        setCurrVote(vote);
        setFetching(false);
    }
    const [currVote,setCurrVote] = useState(0);
    const [fetching,setFetching] = useState(false);

    
    useEffect(() => {
        const getInitVote = async (contr,provi,apprID) => {
            if (cont!==null) {
                setFetching(true);
                const vote = await initVote(contr,provi,apprID);
                setCurrVote(vote);
                setFetching(false);                
            }
        }
        getInitVote(cont,prov,apprID);
    },[cont,prov,apprID])


    

    return (
        <Box>
            {fetching==true ? <Spinner size="xl" /> :
                <Box>
                    {(currVote==0) &&  <AppraisalVoteFormInner onSubmitFunc={onSubmitVote} />}
                    {(currVote>0) && <Text>You've aleady voted on this appraisal request. Your appraisal was ${currVote}</Text>}
                </Box>
            }
            
        </Box>
    )
}

export default AppraisalVoteForm