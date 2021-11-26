// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  let provider = ethers.provider;
  const { chainId,name } = await provider.getNetwork()
  //console.log(chainId+name);
  const linkTokenAddress = (name=='kovan')?"0xa36085F69e2889c224210F603D836748e7dC0088":"0x01BE23585060835E02B77ef475b0Cc51aA1e0709";

  // We get the contract to deploy
  const OracleFactory = await ethers.getContractFactory("Oracle");
  const oracle = await OracleFactory.deploy(linkTokenAddress);

  await oracle.deployed();

  console.log(`oracle deployed to: ${oracle.address} on  ${name}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
