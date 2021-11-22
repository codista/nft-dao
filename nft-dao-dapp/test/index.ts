import { expect } from "chai";
import { ethers,artifacts } from "hardhat";
import type { Contract,BigNumber } from "ethers";
import * as dotenv from "dotenv";
import  { DecentralizedNFTDao } from "../typechain";
import * as confs from "./conf";
import * as helpers from "./testHelpers"
import { boolean } from "hardhat/internal/core/params/argumentTypes";
//import { SSL_OP_EPHEMERAL_RSA } from "constants";
//import fs from "fs";
//import path  from "path";

dotenv.config();

describe("DecentralizedNFTDao Contract", function () {
  let NFTDaoCont: DecentralizedNFTDao;
  let gasPrice: any;
  let gasPriceWei: number;
  let provider = ethers.provider;
  let signer = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
  let secondSigner = new ethers.Wallet( process.env.SECOND_SIGNER as string,provider);
  let user2 = new ethers.Wallet( process.env.User_2 as string,provider);
  let expertSigner = new ethers.Wallet( process.env.EXPERT_SIGNER as string,provider);
  let expertSigner2 = new ethers.Wallet( process.env.EXPERT_2 as string,provider);
  let expertSigner3 = new ethers.Wallet( process.env.EXPERT_3 as string,provider);
  let LINKCont: Contract;
  //let expertWithHistory = new ethers.Wallet( process.env.EXPERT_WITH_HISTORY as string,provider);
  

  before(async function () {
    gasPrice = await provider.getGasPrice();
    gasPriceWei=gasPrice.toNumber();
    LINKCont = new ethers.Contract(confs.LINK_ADDR_RINKEBY,confs.LINK_ABI, signer);
    //console.log(`gas price 1 ${gasPrice}`);
  });

  beforeEach(async function () {
    //deploy contract
    const NFTDaoFactory = await ethers.getContractFactory("DecentralizedNFTDao");
    NFTDaoCont = await NFTDaoFactory.deploy(process.env.ORACLE_CONTRACT as string,process.env.TEST_JOB_ID as string);
    await NFTDaoCont.deployed();
    console.log(`nftdao contract deployed at ${NFTDaoCont.address}`);

    //tansfer link to the newly deployed contract
    let receipt = await LINKCont.transfer(NFTDaoCont.address,(Math.pow(10,18)).toString(),{gasLimit:350000,gasPrice:gasPriceWei});
    let ret = await receipt.wait(1);

    //verify link transfered
    let balance = await LINKCont.balanceOf(NFTDaoCont.address);
    console.log(`contract has ${balance} LINK`);
    
  });
  
  it("Should create an appraisal request for user", async function () {
    
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);
    let appraisals = await NFTDaoCont.getUserAppraisalRequests();
    expect(appraisals[0].nft_id).to.equal(confs.NFT_ID); 
  });

  it("Should return empty array of appraisals for user who never submitted one", async function () {
    
    let NFTDaoContSecond = NFTDaoCont.connect(secondSigner);
    let appraisals = await NFTDaoContSecond.getUserAppraisalRequests();
    console.log(appraisals);
    
    expect(appraisals.length).to.equal(0); 
  });

  it("Should successfully receive expertise score from chainlink when expert joins dao", async function () {
    //connect and join dao as expert
    let NFTDContExp = NFTDaoCont.connect(expertSigner);
    
    await helpers.joinDao(NFTDContExp,gasPriceWei);
    
    
    let status = await NFTDContExp.getExpertStatus(expertSigner.address);
    expect(status).to.equal(1); //pending chainlink response

    let score = await helpers.waitForChainlinkScore(NFTDContExp,expertSigner.address);
    
    expect(score).to.not.be.false;
    expect(score).to.be.within(1,10000);
    
  });

  it("Should return open appraisals matching an experts score", async function () {
    let NFTDContExp = NFTDaoCont.connect(expertSigner);
    await helpers.joinDao(NFTDContExp,gasPriceWei);
    let score = await helpers.waitForChainlinkScore(NFTDContExp,expertSigner.address) as  number;

    //add 4 total appraisal requests with only 2 being a match for this expert
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,score+1,gasPriceWei,2000000000000000);
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,score+1,gasPriceWei,2000000000000000);
    
    //get expert compatible appraisal requests
    let appraisals = await NFTDContExp.getAppraisalsForExpert({gasLimit:350000,gasPrice:gasPriceWei});
    expect(appraisals.length).to.equal(2); 
  });

  it("Should enable an expert to vote on compatible open appraisal request", async function () {
    let NFTDContExp = NFTDaoCont.connect(expertSigner);
    await helpers.joinDao(NFTDContExp,gasPriceWei);
    let score = await helpers.waitForChainlinkScore(NFTDContExp,expertSigner.address) as  number;
    
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);

    //get expert compatible appraisal requests
    let appraisals = await NFTDContExp.getAppraisalsForExpert({gasLimit:350000,gasPrice:gasPriceWei});
    expect(appraisals.length).to.equal(2);

    //vote on appraisals
    for(var i=0;i<appraisals.length;i++){
      await helpers.vote(NFTDContExp,appraisals[i].appraisal_id.toNumber(),confs.APPRAISAL_SUM);
    }
    
    for(var i=0;i<appraisals.length;i++){
      let votes = await NFTDaoCont.getAppraisalVotes(appraisals[i].appraisal_id);
      
      expect(votes.length).to.equal(1);
      expect(votes[0].voter).to.equal(expertSigner.address);
      expect(votes[0].appraised_value_usd).to.equal(confs.APPRAISAL_SUM);
    }
    
  });

  it("Should retrieve vote correctly", async function () {

    let receipt = await LINKCont.transfer(NFTDaoCont.address,(((Math.pow(10,18)))).toString(),{gasLimit:350000,gasPrice:gasPriceWei});
      let ret = await receipt.wait(1);    

    let NFTDContExp = NFTDaoCont.connect(expertSigner);
    let NFTDContExp2 = NFTDaoCont.connect(expertSigner2);
    let NFTDContExp3 = NFTDaoCont.connect(expertSigner3);
    
    
    await helpers.joinDao(NFTDContExp,gasPriceWei);
    let score = await helpers.waitForChainlinkScore(NFTDContExp,expertSigner.address) as  number;
    await helpers.joinDao(NFTDContExp2,gasPriceWei);
    let score2 = await helpers.waitForChainlinkScore(NFTDContExp2,expertSigner2.address) as  number;
    await helpers.joinDao(NFTDContExp3,gasPriceWei);
    let score3 = await helpers.waitForChainlinkScore(NFTDContExp3,expertSigner3.address) as  number;
    
    
    await helpers.submitAppraisal(NFTDaoCont,confs.NFT_ID,confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);
    await helpers.submitAppraisal(NFTDaoCont,"2000",confs.NFT_CONTRACT,confs.NFT_URL,3,0,gasPriceWei,2000000000000000);

    //get expert compatible appraisal requests
    let appraisals = await NFTDContExp.getAppraisalsForExpert({gasLimit:350000,gasPrice:gasPriceWei});
    expect(appraisals.length).to.equal(2);

    //vote on one appraisal (3 different votes)
    await helpers.vote(NFTDContExp,appraisals[0].appraisal_id.toNumber(),confs.APPRAISAL_SUM);
    await helpers.vote(NFTDContExp2,appraisals[0].appraisal_id.toNumber(),confs.APPRAISAL_SUM);
    await helpers.vote(NFTDContExp3,appraisals[0].appraisal_id.toNumber(),confs.APPRAISAL_SUM);
    
    let apprstatus = await NFTDaoCont.getAppraisalStatus(appraisals[0].appraisal_id);
    
    let vote = await NFTDaoCont.getExpertVote(appraisals[0].appraisal_id.toNumber(),expertSigner.address);
      
    
     
      expect(vote.toNumber()).to.equal(confs.APPRAISAL_SUM);
      
      expect(apprstatus).to.equal(1);
      
      console.log(`last deployed contract at ${NFTDaoCont.address}`);
      //expect(votes[0].appraised_value_usd).to.equal(confs.APPRAISAL_SUM);
    });
    
  

});