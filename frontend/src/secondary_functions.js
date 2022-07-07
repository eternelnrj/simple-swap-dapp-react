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
  
async function approve_and_wait(amountBigNumberWithDecimalsStr, spenderAddress, contractAddress, abi) {
  console.log("inside approve: " + amountBigNumberWithDecimalsStr);
  const tx = await approve(amountBigNumberWithDecimalsStr, spenderAddress, contractAddress, abi);
  await tx.wait(1);

}

function getBigNumberWithDecimals(x, numberDecimals) {
    console.log("before to fixed: " + x);
    x = parseFloat(x).toFixed(numberDecimals);
    console.log("after to fixed: " + x);

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

  export {approve, approve_and_wait,  getBigNumberWithDecimals, getTotalAvailableLinkBigNumberWithDecimals, getTotalAvailableUsdcBigNumberWithDecimals,
     getTotalAmountLpTokensBigNumberWithDecimals};