require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.6",
  networks: {
    // sepolia: {
    //   url: SEPOLIA_URL,
    //   accounts: [PRIVATE_KEY],
    // },
    // hardhat: {
    //   chainId: 31337,
    // },
    zkEVM: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [PRIVATE_KEY],
    },
  },
};
