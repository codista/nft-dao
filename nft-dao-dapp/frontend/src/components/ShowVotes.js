import {useState,useEffect} from "react"
import { Spinner,Box,Text,Button,Stack } from "@chakra-ui/react"

const ShowVotes = ({apprID,cont,prov}) => {

    const [showVotesToggle,setShowVotesToggle] = useState(false);
    const [votes,setVotes] = useState(null);
    const [fetching,setFetching] = useState(false);

    async function showVotesFunc() {
        
        
        
        if (!showVotesToggle && votes==null){
            setFetching(true);
            let votes = await  cont.getAppraisalVotes(apprID);
            
            setVotes(votes);
            setFetching(false);
        }
        setShowVotesToggle(!showVotesToggle);

    }
    return (
        <Box>
            <Button colorScheme="blue" variant="outline" onClick={showVotesFunc}>
                {showVotesToggle? 'Hide Votes':'Show Votes'}
            </Button>
            {showVotesToggle && (votes!=null) &&
                votes.map((vt) => (<Box textAlign ={'left'}  rounded={'lg'} bg={'gray.50'} boxShadow={'lg'} p={8}>
                                        <Box key={vt.voter} ><Text>Voter: </Text><Text>{vt.voter}</Text></Box>
                                        <Box><Text>Appraisal: </Text><Text>{vt.appraised_value_usd.toNumber()}</Text></Box>
                                    </Box>)) 
            }
        </Box>            
    )
}

export default ShowVotes
