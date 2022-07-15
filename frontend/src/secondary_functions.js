import {simpleSwapInfo} from "./contracts_and_abi.js";
import Moralis from "moralis";

const BigNumber = require('bignumber.js');


async function approve(amountBigNumberWithDecimalsStr, spenderAddress, contractAddress, abi) {

    const writeOptionsApproval = {
        contractAddress: contractAddress,
        functionName: "approve",
        abi: abi,
        params: {spender: spenderAddress, amount: amountBigNumberWithDecimalsStr}
    };
  
    return await Moralis.executeFunction(writeOptionsApproval);
  }

function getBigNumberWithDecimals(x, numberDecimals) {
    x = parseFloat(x).toFixed(numberDecimals);

    let xAsBigNumber = new BigNumber(x.toString());
    let yAsBigNumberWithDecimals = new BigNumber("1".concat("0".repeat(numberDecimals) ));
    return xAsBigNumber.multipliedBy(yAsBigNumberWithDecimals);
  }    
  
async function getTotalAvailableLinkBigNumberWithDecimals() {
  
    const readOptionsTotalAvailableLink = {
      contractAddress: simpleSwapInfo["contractAddress"],
      functionName: "totalAvailableLink",
      abi: simpleSwapInfo["abi"]
    };
  
    const totalAvailableLink = await Moralis.executeFunction(readOptionsTotalAvailableLink);
    const totalAvailableLinkBigNumber = new BigNumber(totalAvailableLink.toString());
  
    return totalAvailableLinkBigNumber;
  }
  
async function getTotalAvailableUsdcBigNumberWithDecimals() {
  const readOptionsTotalAvailableUSDC = {
    contractAddress: simpleSwapInfo["contractAddress"],
    functionName: "totalAvailableUSDC",
    abi: simpleSwapInfo["abi"]
  };

  const totalAvailableUSDC = await Moralis.executeFunction(readOptionsTotalAvailableUSDC);
  const totalAvailableUSDCBigNumber = new BigNumber(totalAvailableUSDC.toString());
  
  return totalAvailableUSDCBigNumber;
}
  
async function getTotalAmountLpTokensBigNumberWithDecimals() {
    const readOptionsTotalLpTokens = {
      contractAddress: simpleSwapInfo["contractAddress"],
      functionName: "totalLpTokens",
      abi: simpleSwapInfo["abi"]
    };
    
    const totalAmountLpTokens = await Moralis.executeFunction(readOptionsTotalLpTokens);
    const totalAmountLpTokensBigNumber = new BigNumber(totalAmountLpTokens.toString());

    return totalAmountLpTokensBigNumber;
}

  export {approve, getBigNumberWithDecimals, getTotalAvailableLinkBigNumberWithDecimals, getTotalAvailableUsdcBigNumberWithDecimals,
     getTotalAmountLpTokensBigNumberWithDecimals};