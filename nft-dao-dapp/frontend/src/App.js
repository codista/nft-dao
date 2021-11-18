import React from 'react';
import {useState} from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import Header from "./components/Header"
import { ethers } from "ethers";
import { NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI} from "./contracts/conf"
import { requestUserConnect } from "./bootstrap/initialize"
import Description from"./components/Description"
import Appraisals from "./components/Appraisals"

function App() {
  const [connectedAccount,setConnectedAccount] = useState("");
  const [ethersProvider,setEthersProvider] = useState(null);
  const [ExpNFTCont,SetExpNFTCont] = useState(null);

  async function connectToMetamask()
  {
    let {provider,account} = await requestUserConnect();
    setEthersProvider(provider);
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, provider.getSigner());
    setConnectedAccount(account);
    
    SetExpNFTCont(expertApprCont);
  }

  async function submitApraisal()
  {
    if (ethersProvider===null) {
      alert("please connect wallet first");
      return;
    }
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, ethersProvider.getSigner());
    try {
      let tx = await expertApprCont.SubmitNFTForAppraisal("0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
      "5628",
      "https://testnets.opensea.io/assets/0x16baf0de678e52367adc69fd067e5edd1d33e3bf/5628",
        5,
        1000,{value:2000000000000000});
      let receipt = tx.wait(1);
    } catch(error){
      alert("failed to submit appraisal");
    }

    let appraisals = await expertApprCont.getUserAppraisalRequests();
    console.log(appraisals);

  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="l">
        <Header connected={connectedAccount} connectFunc={connectToMetamask}/>
        <Box bgGradient="linear(to-b, #e3f4fa, white)" minH="1000" width="100%">
            <Description />
            <Appraisals connected={connectedAccount} cont={ExpNFTCont} ></Appraisals>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
