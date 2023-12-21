const hre = require("hardhat");

async function main() {
  const RPS = await hre.ethers.deployContract("RPS");

  await RPS.waitForDeployment();

  console.log("contract Address:", RPS.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
