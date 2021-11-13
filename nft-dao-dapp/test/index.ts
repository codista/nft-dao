import { expect } from "chai";
import { ethers,artifacts } from "hardhat";
import type Contract from "ethers";
import * as dotenv from "dotenv";
import  { DecentralizedNFTDao } from "../typechain";
//import { SSL_OP_EPHEMERAL_RSA } from "constants";
//import fs from "fs";
//import path  from "path";

dotenv.config();

describe("DecentralizedNFTDao Contract", function () {
  let NFTDaoCont: DecentralizedNFTDao;
  let gasPrice: any;
  let provider = ethers.provider;
  let signer = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
  let secondSigner = new ethers.Wallet( process.env.SECOND_SIGNER as string,provider);
  let expertSigner = new ethers.Wallet( process.env.EXPERT_SIGNER as string,provider);
  let expertSigner2 = new ethers.Wallet( process.env.EXPERT_2 as string,provider);
  let expertSigner3 = new ethers.Wallet( process.env.EXPERT_3 as string,provider);
  let user2 = new ethers.Wallet( process.env.User_2 as string,provider);

  let nft_id=5628;
  let nft_contract="0x16baf0de678e52367adc69fd067e5edd1d33e3bf";
  let nft_url="https://testnets.opensea.io/assets/0x16baf0de678e52367adc69fd067e5edd1d33e3bf/5628";

  const appraisal_sum = 36500000;
  before(async function () {
    //await hre.run('compile');
    //let NFTDaoAddr = process.env.NFT_DAO_ADDRESS as string;
    //let tcArtifacts = await artifacts.readArtifact("DecentralizedNFTDao");
    
    //NFTDaoCont = new ethers.Contract(NFTDaoAddr,tcArtifacts.abi, signer) as DecentralizedNFTDao;
    const NFTDaoFactory = await ethers.getContractFactory("DecentralizedNFTDao");
    NFTDaoCont = await NFTDaoFactory.deploy(process.env.ORACLE_CONTRACT as string,process.env.TEST_JOB_ID as string);
    await NFTDaoCont.deployed();
    console.log(`nftdao contract deployed at ${NFTDaoCont.address}`)
    gasPrice = await provider.getGasPrice();
    
    //console.log(`gas price 1 ${gasPrice}`);
  });

  beforeEach(async function () {
    //NFTDaoCont.connect(signer);
  });
  
  it("Should create an appraisal request for user", async function () {
    
    
    
    let res = await NFTDaoCont.SubmitNFTForAppraisal(nft_contract,
                                                    nft_id,
                                                    nft_url,
                                                  3,
                                                  85000,
                                                  {gasLimit:350000,gasPrice:gasPrice.toNumber(),value:2000000000000000});
    let ret = await res.wait(1);
    
    //res = res as Contract.ethers.ContractTransaction
    
    
    let appraisals = await NFTDaoCont.getUserAppraisalRequests();
    //console.log(appraisals[0]);
    
    expect(appraisals[0].nft_id).to.equal(nft_id); 
  });

  it("Should return empty array of appraisals for user who never submitted one", async function () {
    
    let NFTDaoContSecond = NFTDaoCont.connect(secondSigner);
    let appraisals = await NFTDaoContSecond.getUserAppraisalRequests();
    console.log(appraisals);
    
    expect(appraisals.length).to.equal(0); 
  });

  it("Should return open appraisals matching an experts score", async function () {
    //connect and join dao as expert
    let NFTDaoContExpert = NFTDaoCont.connect(expertSigner);
    let receipt = await NFTDaoContExpert.JoinDao({gasLimit:350000,gasPrice:gasPrice.toNumber()});
    let ret = await receipt.wait(1);
    //add 4 total appraisal requests with only 2 being a match for this expert (score:8.0000)
    receipt = await NFTDaoCont.SubmitNFTForAppraisal(nft_contract,
                          nft_id,
                          nft_url,
                        3,
                        70000,
                        {gasLimit:350000,gasPrice:gasPrice.toNumber(),value:2000000000000000});  
    ret = await receipt.wait(1);

    receipt = await NFTDaoCont.SubmitNFTForAppraisal(nft_contract,
      nft_id,
      nft_url,
      3,
      72000,
      {gasLimit:350000,gasPrice:gasPrice.toNumber(),value:2000000000000000});  
    ret = await receipt.wait(1);
    
    receipt = await NFTDaoCont.SubmitNFTForAppraisal(nft_contract,
      nft_id,
      nft_url,
      3,
      90000,
      {gasLimit:350000,gasPrice:gasPrice.toNumber(),value:2000000000000000});  
    ret = await receipt.wait(1);
    

    //get expert compatible appraisal requests
    let appraisals = await NFTDaoContExpert.getAppraisalsForExpert({gasLimit:350000,gasPrice:gasPrice.toNumber()});
    expect(appraisals.length).to.equal(2); 
  });

  it("Should enable an expert to vote on compatible open appraisal request", async function () {
    
    
    let NFTDaoContExpert = NFTDaoCont.connect(expertSigner);

    let NFTDaoContExpert2 = NFTDaoCont.connect(expertSigner2);
    let receipt = await NFTDaoContExpert2.JoinDao({gasLimit:350000,gasPrice:gasPrice.toNumber()});
    let ret = await receipt.wait(1);

    //get expert compatible appraisal requests
    let appraisals = await NFTDaoContExpert.getAppraisalsForExpert({gasLimit:350000,gasPrice:gasPrice.toNumber()});
    expect(appraisals.length).to.equal(2); 
    for(var i=0;i<appraisals.length;i++){
      //1st voter
      let receipt = await NFTDaoContExpert.SubmitAppraisalVote(appraisals[i].appraisal_id,appraisal_sum);
      let res = await receipt.wait(1);

      receipt = await NFTDaoContExpert2.SubmitAppraisalVote(appraisals[i].appraisal_id,appraisal_sum);
      res = await receipt.wait(1);

      console.log(`voted on appr ${appraisals[i].appraisal_id} `)
    }
    
    for(var i=0;i<appraisals.length;i++){
      let votes = await NFTDaoCont.getAppraisalVotes(appraisals[i].appraisal_id);
      //console.log(`votes for appr ${appraisals[i].appraisal_id} are ${votes}`)
      expect(votes.length).to.equal(2);
      expect(votes[0].voter).to.equal(expertSigner.address);
      expect(votes[0].appraised_value_usd).to.equal(appraisal_sum);
    }
    
  });

});