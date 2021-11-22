import React from 'react';
import {useState} from 'react';
import {
  ChakraProvider,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  theme,
} from '@chakra-ui/react';
import Header from "./components/Header"
import { ethers } from "ethers";
import { NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI} from "./contracts/conf"
import { requestUserConnect } from "./bootstrap/initialize"
import Description from"./components/Description"
import Appraisals from "./components/Appraisals"
import AppraisalVotes from "./components/AppraisalVotes"

function App() {
  const [connectedAccount,setConnectedAccount] = useState("");
  const [ethersProvider,setEthersProvider] = useState(null);
  const [ExpNFTCont,SetExpNFTCont] = useState(null);

  async function connectToMetamask()
  {
    let provider = await requestUserConnect();
    setEthersProvider(provider);
    let address = await provider.getSigner().getAddress();
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, provider.getSigner());
   
    setConnectedAccount(address);
    
    SetExpNFTCont(expertApprCont);
    window.ethereum.on('accountsChanged', function (accounts) {
      const prov = new ethers.providers.Web3Provider(window.ethereum, "any");
      setEthersProvider(prov);
      const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, provider.getSigner());
      SetExpNFTCont(expertApprCont);
      setConnectedAccount(accounts[0]);
    })
  }

  

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="l">
        <Header connected={connectedAccount} connectFunc={connectToMetamask}/>
        
        <Box bgGradient="linear(to-b, #e3f4fa, white)" minH="1000" width="100%">
            <Description />
            <Tabs  colorScheme="blue"  padding="20" >
              <TabList>
                <Tab>Your Appraisal Requests</Tab>
                <Tab>Vote on Appraisal Requests</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Appraisals connected={connectedAccount} cont={ExpNFTCont} prov={ethersProvider} ></Appraisals>
                </TabPanel>
                <TabPanel>
                <AppraisalVotes connected={connectedAccount} cont={ExpNFTCont} prov={ethersProvider} ></AppraisalVotes>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
