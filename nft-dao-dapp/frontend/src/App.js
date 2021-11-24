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
import {useEffect,useCallback} from "react"

function App() {
  const [connectedAccount,setConnectedAccount] = useState("");
  const [ethersProvider,setEthersProvider] = useState(null);
  const [ExpNFTCont,SetExpNFTCont] = useState(null);

  

  async function initProvider(prov)
  {
    const ethProv = new ethers.providers.Web3Provider(prov, "any");
    setEthersProvider(ethProv);
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, ethProv.getSigner());
    let address = await ethProv.getSigner().getAddress();
    SetExpNFTCont(expertApprCont);
    setConnectedAccount(address);
  }
  

  async function hadleConnection(forced) {
    let provider = await requestUserConnect(forced);
    if (provider!==null) {
      initProvider(provider);
    }
  }
  
  async function handleAccountsChanged(accounts)
  {
    let provider = await requestUserConnect(false);
    if (provider!==null) {
        const ethProv = new ethers.providers.Web3Provider(provider, "any");
        setEthersProvider(ethProv);
        const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, ethProv.getSigner());
        let address = await ethProv.getSigner().getAddress();
        SetExpNFTCont(expertApprCont);
        setConnectedAccount(address);
    }
  }

  useEffect(() => {
    async function initcon() {
      console.log("in init con");
      let provider = await requestUserConnect(false);
      if (provider!==null) {
          const ethProv = new ethers.providers.Web3Provider(provider, "any");
          setEthersProvider(ethProv);
          const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, ethProv.getSigner());
          let address = await ethProv.getSigner().getAddress();
          SetExpNFTCont(expertApprCont);
          setConnectedAccount(address);
      }
    }
    initcon();
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    }  ,[]);


  async function connectToMetamask()
  {
    await hadleConnection(true);
  }

  

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="l">
        <Header connected={connectedAccount} connectFunc={connectToMetamask}/>
        
        <Box bgGradient="linear(to-b, #e3f4fa, white)" minH="1000" width="100%">
            
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
