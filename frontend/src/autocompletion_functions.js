import {calculateAmountPurchasedToken, calculateAmountSoldToken, getLpTokenPriceBigNumberWithDecimals} from "./price_functions.js"

// import in Swap.tsx, create 1 method changeInput, it should change
async function changeUsdcInput(tokenForSale) {
    if (tokenForSale == 0) {
      const amountUsdc = await calculateAmountPurchasedToken(document.getElementById("link-input").value, tokenForSale);
      document.getElementById("usdc-input").value = amountUsdc;
    }
    else {
      const amountUsdc = await calculateAmountSoldToken(document.getElementById("link-input").value, tokenForSale);
      document.getElementById("usdc-input").value  = amountUsdc;
    }
  
  }
  
async function changeLinkInput(tokenForSale) {
    if (tokenForSale == 0) {
      const amountLink = await calculateAmountSoldToken(document.getElementById("usdc-input").value, tokenForSale);
      document.getElementById("link-input").value = amountLink;
    }
    else {
      const amountLink = await calculateAmountPurchasedToken(document.getElementById("usdc-input").value, tokenForSale);
      document.getElementById("link-input").value  = amountLink;
    }
}
  
function changeMinAmountReceived(tokenForSale){
    const amountOfPurchasedToken = (tokenForSale == 0) ? document.getElementById("usdc-input").value : document.getElementById("link-input").value;
    const maxSlippage = document.getElementById("slippage").value;
    const minAmountPurchasedToken = amountOfPurchasedToken * (1 - maxSlippage/100);
  
    const tokenPurchasedStr = (tokenForSale == 0) ? "USDC" : "Link";
  
    document.getElementById("min_amount_purchased_token").innerHTML = "Min amount of " +  tokenPurchasedStr + " to receive: " + minAmountPurchasedToken.toFixed(4).toString();
    document.getElementById("min_amount_purchased_token").setAttribute("data-value", minAmountPurchasedToken);
  }
  
async function changeAmountUsdcToSupply() {
    const amountLink = parseFloat(document.getElementById("supply-link-input").value);
    const [lpTokenPriceLink, lpTokenPriceUsdc] = await getLpTokenPriceBigNumberWithDecimals();
  
    document.getElementById("supply-usdc-input").value = (amountLink / lpTokenPriceLink.shiftedBy(-18).toNumber()) * lpTokenPriceUsdc.shiftedBy(-6).toNumber();
  }
  

async function changeAmountLinkToSupply() {
   
    const amountUsdc = parseFloat(document.getElementById("supply-usdc-input").value);
    const [lpTokenPriceLink, lpTokenPriceUsdc] = await getLpTokenPriceBigNumberWithDecimals();
  
    document.getElementById("supply-link-input").value = (amountUsdc / lpTokenPriceUsdc.shiftedBy(-6).toNumber()) * lpTokenPriceLink.shiftedBy(-18).toNumber();
  
  }
  
  

  export {changeUsdcInput, changeLinkInput, changeMinAmountReceived, changeAmountUsdcToSupply,  changeAmountLinkToSupply};