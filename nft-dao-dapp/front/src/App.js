import Header from "./components/Header"

// eslint-disable-next-line
import styled from 'styled-components'
import { useState } from "react";
import { requestUserConnect } from "./bootstrap/initialize"
import { NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI} from "./contracts/conf"
import { ethers } from "ethers";
const Container = styled.div`
  text-align: center;
`



function App() {
  const [connectedAccount,setConnectedAccount] = useState("");
  const [ethersProvider,setEthersProvider] = useState(null);

  async function connectToMetamask()
  {
    let {provider,account} = await requestUserConnect();
    setConnectedAccount(account);
    setEthersProvider(provider);
  }

  async function submitApraisal()
  {
    if (ethersProvider===null) {
      alert("please connect wallet first");
      return;
    }
    const expertApprCont = new ethers.Contract(NFTEXP_CONTRACT_ADDRESS, NFTEXP_CONTRACT_ABI, ethersProvider.getSigner());
    /*try {
      let tx = await expertApprCont.SubmitNFTForAppraisal("0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
      "5628",
      "https://testnets.opensea.io/assets/0x16baf0de678e52367adc69fd067e5edd1d33e3bf/5628",
        5,
        1000,{value:2000000000000000});
      let receipt = tx.wait(1);
    } catch(error){
      alert("failed to submit appraisal");
    }*/

    let appraisals = await expertApprCont.getUserAppraisalRequests();
    console.log(appraisals);

  }

  return (
    <Container >
        <Header connected={connectedAccount} connectFunc={connectToMetamask}/>
        <button onClick={submitApraisal}>submit appraisal</button>
    </Container>
  );
}

export default App;
