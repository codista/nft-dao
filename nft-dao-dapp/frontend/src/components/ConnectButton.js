
import {Button} from '@chakra-ui/react';
const ConnectButton = ({connected, connectFunc}) => {
    async function  callConnect() {
        await connectFunc();
    }

    return (
        connected===""?
        <Button colorScheme="blue" variant="outline" onClick={callConnect}>
            Connect to Metamask
        </Button>
        :
        <Button colorScheme="blue" >
            Connected to {connected}
        </Button>
    )
}

export default ConnectButton
