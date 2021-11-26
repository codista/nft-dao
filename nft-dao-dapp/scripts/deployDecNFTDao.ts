
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as confs from "./../test/conf";
import fs from "fs";
import path from "path"
dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  let provider = ethers.provider;
  const { name } = await provider.getNetwork();

  // We get the contract to deploy
  const NFTDaoFactory = await ethers.getContractFactory("DecentralizedNFTDao");
  const oracleAddress = (name=='kovan')?process.env.ORACLE_CONTRACT_KOVAN as string:process.env.ORACLE_CONTRACT as string;
  const NFTDao = await NFTDaoFactory.deploy(oracleAddress,process.env.TEST_JOB_ID as string);

  await NFTDao.deployed();

  console.log(`testClient deployed to: ${NFTDao.address} on ${name}`);

  //feed with link
  let gasPrice = await provider.getGasPrice();
  let gasPriceWei=gasPrice.toNumber();
  let initialLinkAmount = 5;
  let signer = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
  let linkContAddress=(name=='kovan')?confs.LINK_ADDR_KOVAN:confs.LINK_ADDR_RINKEBY;
  let LINKCont = new ethers.Contract(linkContAddress,confs.LINK_ABI, signer);
  let tx = await LINKCont.transfer(NFTDao.address,(initialLinkAmount*((Math.pow(10,18)))).toString(),{gasLimit:350000,gasPrice:gasPriceWei});
  let rec = await tx.wait(1);
  console.log(`transfered : ${initialLinkAmount} LINK to new contract on ${name}`);


  //write to frontend and api
  let contArt;
  try {
    contArt = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../artifacts/contracts/DecentralizedNFTDao.sol/DecentralizedNFTDao.json'), 'utf8'));
  } catch(err) {
    console.error("failed to parse artifacts");
    return;
  }
  let contAbi = contArt.abi;
  let contAbiStr= JSON.stringify(contAbi);

  let contractString: string =(name=='kovan')?'export const NFTEXP_CONTRACT_ADDRESS_KOVAN="':'export const NFTEXP_CONTRACT_ADDRESS="';
  contractString+=NFTDao.address;
  contractString+='";\n';
  contractString+=(name=='kovan')?'export const NFTEXP_CONTRACT_ABI_KOVAN=':'export const NFTEXP_CONTRACT_ABI=';
  contractString+=contAbiStr;
  contractString+=';\n';
  //console.log(contractString);
  let confFileName = (name=='kovan')?'confKovan.js':'conf.js';

  //write to frontend
  var confPath = path.join(__dirname, '..', 'frontend', 'src', 'contracts',confFileName);  
  console.log(`path to write is ${confPath}`);
  try {
    fs.writeFileSync(confPath,contractString);
  }catch(err) {
    console.error("failed to write to file");
    return;
  }
  console.log(`successfully wrote contract details to  ${confPath}`);


  //write to api
  var confPathApi = path.join(__dirname, '..', '..','nft-score-api', 'src',confFileName);  
  console.log(`path to write is ${confPathApi}`);
  try {
    fs.writeFileSync(confPathApi,contractString);
  }catch(err) {
    console.error("failed to write to file");
    return;
  }
  console.log(`successfully wrote contract details to  ${confPathApi}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
