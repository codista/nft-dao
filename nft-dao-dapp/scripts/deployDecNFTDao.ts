
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
