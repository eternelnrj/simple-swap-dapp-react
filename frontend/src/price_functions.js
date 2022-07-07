import {getTotalAvailableLinkBigNumberWithDecimals, getTotalAvailableUsdcBigNumberWithDecimals, getBigNumberWithDecimals} from "./secondary_functions.js";
import {simpleSwapInfo} from "./contracts_and_abi.js";
import Moralis from "moralis";

const BigNumber = require('bignumber.js');

// (x + dx ) ( y - dy) = cst
// return y - cst / (x + dx)

async function calculateAmountPurchasedToken(amountSoldToken, tokenForSale) {

    // x : sold token 
    // y : purchased token
    const totalLinkAvaialbe = await getTotalAvailableLinkBigNumberWithDecimals();
    const totalUsdcAvailable = await getTotalAvailableUsdcBigNumberWithDecimals();

    const numberDecimalsSoldToken = (tokenForSale == 0) ? 18 : 6;
    const numberDecimalsPurchasedToken = (tokenForSale == 0) ? 6 : 18;

    const x = (tokenForSale == 0) ? totalLinkAvaialbe : totalUsdcAvailable;
    const y = (tokenForSale == 0) ? totalUsdcAvailable : totalLinkAvaialbe;
    
    const d_x = getBigNumberWithDecimals(amountSoldToken, numberDecimalsSoldToken);
    const d_y = y.minus(totalLinkAvaialbe.multipliedBy(totalUsdcAvailable).dividedBy(x.plus(d_x)) );
    
    return d_y.shiftedBy(-numberDecimalsPurchasedToken).toNumber();
}


// (x + dx ) ( y - dy) = cst
// return cst / (y - dy) - x
async function calculateAmountSoldToken(amountPurchasedToken, tokenForSale) {

    const totalLinkAvaialbe = await getTotalAvailableLinkBigNumberWithDecimals();
    const totalUsdcAvailable = await getTotalAvailableUsdcBigNumberWithDecimals();
    
    const numberDecimalsSoldToken = (tokenForSale == 0) ? 18 : 6;
    const numberDecimalsPurchasedToken = (tokenForSale == 0) ? 6 : 18;

    const x = (tokenForSale == 0) ? totalLinkAvaialbe : totalUsdcAvailable;
    const y = (tokenForSale == 0) ? totalUsdcAvailable : totalLinkAvaialbe;

    const d_y = getBigNumberWithDecimals(amountPurchasedToken, numberDecimalsPurchasedToken);
    const d_x = ((totalLinkAvaialbe.multipliedBy(totalUsdcAvailable)).dividedBy(y.minus(d_y))).minus(x);

    return d_x.shiftedBy(-numberDecimalsSoldToken).toNumber();
}

async function getLpTokenPriceBigNumberWithDecimals() {
    const readOptionsGetLpTokenPrice = {
      contractAddress: simpleSwapInfo["contractAddress"],
      functionName: "getLpTokenPrice",
      abi: simpleSwapInfo["abi"],
    };

    const [lpTokenPriceLink, lpTokenPriceUsdc] = await Moralis.executeFunction(readOptionsGetLpTokenPrice);
    return [new BigNumber(lpTokenPriceLink.toString()), new BigNumber(lpTokenPriceUsdc.toString())];
  }
  
  
export {calculateAmountPurchasedToken,  calculateAmountSoldToken, getLpTokenPriceBigNumberWithDecimals};