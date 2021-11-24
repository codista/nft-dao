
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

  // We get the contract to deploy
  const NFTDaoFactory = await ethers.getContractFactory("DecentralizedNFTDao");
  const NFTDao = await NFTDaoFactory.deploy(process.env.ORACLE_CONTRACT as string,process.env.TEST_JOB_ID as string);

  await NFTDao.deployed();

  console.log("testClient deployed to:", NFTDao.address);

  //feed with link
  let provider = ethers.provider;
  let gasPrice = await provider.getGasPrice();
  let gasPriceWei=gasPrice.toNumber();
  let signer = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
  let LINKCont = new ethers.Contract(confs.LINK_ADDR_RINKEBY,confs.LINK_ABI, signer);
  let tx = await LINKCont.transfer(NFTDao.address,(4*((Math.pow(10,18)))).toString(),{gasLimit:350000,gasPrice:gasPriceWei});
  let rec = await tx.wait(1);

let contArt;
try {
  contArt = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../artifacts/contracts/DecentralizedNFTDao.sol/DecentralizedNFTDao.json'), 'utf8'));
} catch(err) {
  console.error("failed to parse artifacts");
  return;
}
  let contAbi = contArt.abi;
  let contAbiStr= JSON.stringify(contAbi);

  let contractString: string ='export const NFTEXP_CONTRACT_ADDRESS="';
  contractString+=NFTDao.address;
  contractString+='";\n';
  contractString+='export const NFTEXP_CONTRACT_ABI=';
  contractString+=contAbiStr;
  contractString+=';\n';
  //console.log(contractString);

  var confPath = path.join(__dirname, '..', 'frontend', 'src', 'contracts','conf.js');  
  console.log(`path to write is ${confPath}`);
  try {
    fs.writeFileSync(confPath,contractString);
  }catch(err) {
    console.error("failed to write to file");
    return;
  }

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
