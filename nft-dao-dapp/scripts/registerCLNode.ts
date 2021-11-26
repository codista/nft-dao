// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";
import { Oracle } from "../typechain";
import path  from "path";

dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let provider = ethers.provider;
  const { name } = await provider.getNetwork();

  if (process.env.ORACLE_CONTRACT === undefined || process.env.CHAINLINK_NODE_ADDRESS=== undefined || process.env.PRIVATE_KEY=== undefined || process.env.ORACLE_CONTRACT_KOVAN === undefined || process.env.CHAINLINK_NODE_ADDRESS_KOVAN === undefined )
  {
      console.error('no oracle address or chainlink node or signer address defined');
      return false;
  }
  let orcAddr = (name=='kovan')?process.env.ORACLE_CONTRACT_KOVAN as string: process.env.ORACLE_CONTRACT as string;
  let chNodeAddr = (name=='kovan')?process.env.CHAINLINK_NODE_ADDRESS_KOVAN as string:process.env.CHAINLINK_NODE_ADDRESS as string;
  let orcABI;
  try {
    
    orcABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../node_modules/@chainlink/contracts/abi/v0.6/Oracle.json'), 'utf8'));
    
  }
  catch(error) {
      console.error('failed to retrieve oracle.sol contract abi'+error);
      return false;
  }

  let signer = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
  let orac_contract_obj: Oracle = new ethers.Contract(orcAddr,orcABI, signer) as Oracle;
  let gasPrice = await provider.getGasPrice();
  
  console.log(gasPrice.toString());
  let tx: any = await orac_contract_obj.setFulfillmentPermission(chNodeAddr,true,{gasLimit:90000,gasPrice:gasPrice.toNumber()});
  let receipt: any = await tx.wait(1);

  let auth: boolean = await orac_contract_obj.getAuthorizationStatus(chNodeAddr);
  

  console.log(`Chainlink node added to oracle contract: ${auth} on ${name}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
