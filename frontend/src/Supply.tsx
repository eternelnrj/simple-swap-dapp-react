import * as React from 'react'
import {Button, View} from 'react-native';
import Moralis from "moralis";

import {getLpTokenPriceBigNumberWithDecimals} from "./price_functions.js"
import {simpleSwapInfo, usdcInfo, linkInfo} from "./contracts_and_abi.js";
import {approve, getBigNumberWithDecimals} from "./secondary_functions.js";

import link from "./images/link.png";
import usdc from "./images/usdc.png";
  

class Supply extends React.Component<any, any>{
    constructor(props : any) {
        super(props);
        this.state = {
          amountLink : 0.0,
          amountUsdc : 0.0,
        }
      }

    handleSubmit = async () => {
        const amountUsdc = this.state.amountUsdc;
        const amountLink = this.state.amountLink;
        
        const [priceLinkLpToken, priceUsdcLpToken] = await getLpTokenPriceBigNumberWithDecimals();
        const amountLpTokens = Math.min(amountLink / priceLinkLpToken.shiftedBy(-18).toNumber(),
                                         amountUsdc / priceUsdcLpToken.shiftedBy(-6).toNumber());
      
        const allowedAmountUsdcStr = priceUsdcLpToken.multipliedBy(amountLpTokens).multipliedBy(1.1).toFixed(0).toString();
        const allowedAmountLinkStr = priceLinkLpToken.multipliedBy(amountLpTokens).multipliedBy(1.1).toFixed(0).toString();
      
        const txUsdc : any = await approve(allowedAmountUsdcStr, simpleSwapInfo["contractAddress"],
                                         usdcInfo["contractAddress"], usdcInfo["abi"]);
        await txUsdc.wait();
      
        const txLink : any = await approve(allowedAmountLinkStr, simpleSwapInfo["contractAddress"],
                                         linkInfo["contractAddress"], linkInfo["abi"]);
        await txLink.wait();
      
        const amountLpTokensWithDecimalsStr = getBigNumberWithDecimals(amountLpTokens, 6).toString();
      
        const writeOptionsSupply = {
          contractAddress: simpleSwapInfo["contractAddress"],
          functionName: "supply",
          abi: simpleSwapInfo["abi"],
          params: {amountLpTokens:amountLpTokensWithDecimalsStr}
        };
        await Moralis.executeFunction(writeOptionsSupply);
      }
      

    changeAmountUsdcToSupply = async(event : any) => {
        const amountLink = event.target.value;
        const [lpTokenPriceLink, lpTokenPriceUsdc] = await getLpTokenPriceBigNumberWithDecimals();
        const newAmountUsdc =  (amountLink / lpTokenPriceLink.shiftedBy(-18).toNumber()) * lpTokenPriceUsdc.shiftedBy(-6).toNumber()

        await this.setState({...this.state, amountLink : amountLink, amountUsdc : newAmountUsdc});
      }
      
    
      changeAmountLinkToSupply = async(event : any) => {
        const amountUsdc = event.target.value;
        const [lpTokenPriceLink, lpTokenPriceUsdc] = await getLpTokenPriceBigNumberWithDecimals();
        const newAmountLink = (amountUsdc / lpTokenPriceUsdc.shiftedBy(-6).toNumber()) * lpTokenPriceLink.shiftedBy(-18).toNumber();
        await this.setState({...this.state, amountLink : newAmountLink});
      }

    display = () => {
        console.log(this.state);
    }

    render() {
      return <>
              <div className="SupplyForm">

                <label className="SupplyLink"> 
                  <View style={[{left: -115, width : 100}]} >
                    <img src={link} className="linkSupply" />
                  </View>
                  <View style={[{left: -5, top : 10, width : 170}]}>
                    <input type="number" name="amountLink" value={this.state.amountLink}  onChange={this.changeAmountUsdcToSupply}/>
                  </View>
                </label>

                <label className="SupplyUsdc">  
                  <View style={[{left: -325, width : 100}]} >
                    <img src={usdc} className="usdcSupply" />
                  </View>
                  <View style={[{left: -5, top : 10, width : 170}]} >
                    <input type="number" name="amountUsdc" value={this.state.amountUsdc} onChange={this.changeAmountLinkToSupply}/>
                  </View>
                </label>

              </div>

              <div className="Supply-btn">
                <View >
                  <Button title="Supply"  color="#02882f" onPress={this.handleSubmit}/>
                </View>
              </div>
        
              <div className="showSupply-btn">
                <View >
                  <Button title="show state (supply) in console"  color="#02882f" onPress={this.display}/>
                </View>
              </div>

        </>
    }



  }
  


  export default Supply


