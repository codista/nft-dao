import {Button,Container,Text,Box} from '@chakra-ui/react';

const JoinDaoButton = ({joinDaoFunc, status}) => {
    return (
        <Container>
            
            
            {status==0 ?
            <Text>To vote on appraisal requests you need to join the NFT Expert Appraisal DAO and get evaluated for an expert score. The process is automated and simple. Just click the button below while connected with the Ethereum address that holds most of your NFT activity. You will be added to the DAO with status Pending and as soon as your score is available you'll be able to see it here along with appraisal requrests for which you're eligable to vote.</Text>
            :''}
            <Button colorScheme="blue" variant="outline" onClick={joinDaoFunc} marginTop={20}>{status==0?'Join as Expert':'Click to Resend Join Request'}</Button>
            
            
        </Container>
    )
}

export default JoinDaoButton
