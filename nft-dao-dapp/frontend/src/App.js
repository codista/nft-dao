import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import NFTValueComp from './components/NFTValue'
import { TEST_CLIENT_ABI, TEST_CLIENT_ADDR,ORACLE_CONTRACT,JOB_ID } from './conf'


class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    //const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    //const accounts = await web3.eth.getAccounts()
    //this.setState({ account: accounts[0] })
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      const web3  = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const testClient = new web3.eth.Contract(TEST_CLIENT_ABI, TEST_CLIENT_ADDR);
      this.setState({ testClient })
      const NFTValue = await testClient.methods.currentNFTValue().call();
      this.setState({NFTValue: NFTValue,loading: false});
    }  
  }

  constructor(props) {
    super(props)
    this.state = { account: '', NFTValue: 0,loading: true}
    this.getNFTValue = this.getNFTValue.bind(this);
    
  }

  getNFTValue(contAddress,NFTID) {
    this.setState({ loading: true });
    this.state.testClient.methods.requestNFTValue(ORACLE_CONTRACT,JOB_ID,contAddress,NFTID).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })});
    }

  render() {
    return (
      
        
    
    <div className="container-fluid">
      <div className="row">
      <main role="main" className="col-lg-12 d-flex justify-content-center">
        { this.state.loading
          ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
          : <NFTValueComp NFTValue = {this.state.NFTValue} getNFTValue={this.getNFTValue} />
        }
      </main>
      </div>
    </div>
 
      
    );
  }
}

export default App;