import * as React from 'react'
import {Button, View} from 'react-native';
import Moralis from "moralis";

import {simpleSwapInfo, usdcInfo, linkInfo} from "./contracts_and_abi.js";
import {calculateAmountPurchasedToken, calculateAmountSoldToken} from "./price_functions.js"
import {approve, getBigNumberWithDecimals} from "./secondary_functions.js";

import link from "./images/link.png";
import usdc from "./images/usdc.png";

const NUMBER_DECIMALS = 6;

function TokenForm(props : any) {
  const location = (props.tokenForSale == 0 && props.name == "amountLink") || (props.tokenForSale == 1 && props.name == "amountUsdc") ? 5 : 35;
  const img = (props.name == "amountLink" ? <img src={link} className="link" /> : <img src={usdc} className="usdc" />);
  
  return (<label>
            <View style={[{ top : location, left : 60, width : 30, height : 30}]} >
              {img}
            </View>

            <View style={[{ top : location - 20, left: 100, width : 150}]} >
              <input type="number" name={props.name} value={props.amount} onChange={props.handleChange} />
            </View>
          </label>)
  }

function MaxSlippage(props : any) {
    return (<label>
              Maximum slippage in %:
              <input type="number" name="maxSlippage" value={props.maxSlippage} onChange={props.handleChange} min="0"
              max="100"/>
            </label>)
}


class Swap extends React.Component<any, any>{
    constructor(props : any) {
        super(props);
        this.state = {
          maxSlippage : 1.0,
          amountLink : 0.0,
          amountUsdc : 0.0,
          tokenForSale : 0,
          minAmountReceived : 0,
          _sellForm : TokenForm,
          _buyForm : TokenForm
        }
      }

    handleChange = async (event : any) => {
      await this.setState({...this.state, [event.target.name] : event.target.value});
      if (event.target.name == "maxSlippage")
        {
          const amountBought = (this.state.tokenForSale == 0) ?  this.state.amountUsdc : this.state.amountLink;
          const minAmountReceived = amountBought * (1 - event.target.value/100);
          await this.setState({...this.state, minAmountReceived : minAmountReceived});
        }
    }

    changeMinAmountReceived = async () => {
      const amountBought = (this.state.tokenForSale == 0) ?  this.state.amountUsdc : this.state.amountLink;
      const minAmountReceived = amountBought * (1 - this.state.maxSlippage/100);
      await this.setState({...this.state, minAmountReceived : minAmountReceived.toFixed(NUMBER_DECIMALS)});
    }

    changeForms = async () => {
        await this.setState({...this.state, amountLink : 0.0,  amountUsdc : 0.0, _sellForm : this.state._buyForm,
           _buyForm : this.state._sellForm, tokenForSale : (this.state.tokenForSale + 1) % 2});
    }

    changeInput = async(event : any) => {
      if (event.target.name == "amountLink")
      {
        if (this.state.tokenForSale == 0) {
          const amountUsdc = await calculateAmountPurchasedToken(this.state.amountLink, this.state.tokenForSale);
          await this.setState({...this.state, amountUsdc : amountUsdc});

        }
        else {
          const amountUsdc = await calculateAmountSoldToken(this.state.amountLink, this.state.tokenForSale);
          await this.setState({...this.state, amountUsdc : amountUsdc});

        }
     }
     else
      {
        if (this.state.tokenForSale == 0) {
          const amountLink = await calculateAmountSoldToken(this.state.amountUsdc, this.state.tokenForSale);
          await this.setState({...this.state, amountLink : amountLink});

        }
        else {
          const amountLink = await calculateAmountPurchasedToken(this.state.amountUsdc, this.state.tokenForSale);
          await this.setState({...this.state, amountLink : amountLink});

        }
     }
    }

    swap = async() =>  {
      const amountSoldToken = (this.state.tokenForSale == 0) ? this.state.amountLink : this.state.amountUsdc;
    
      if (amountSoldToken <= 0)
        {
          console.log("The amount of token sold should be > 0!");
        }
        
      else {
        const minAmountPurchasedToken = this.state.minAmountReceived;
    
        const numberDecimalsSoldToken = (this.state.tokenForSale == 0) ? 18 : 6;
        const numberDecimalsPurchasedToken = (this.state.tokenForSale == 0) ? 6 : 18;
    
        const amountSoldTokenStr = getBigNumberWithDecimals(amountSoldToken, numberDecimalsSoldToken).toString();
        const minAmountPurchasedTokenStr = getBigNumberWithDecimals(minAmountPurchasedToken, numberDecimalsPurchasedToken).toString();
          
        const soldTokenContractAdress = (this.state.tokenForSale == 0) ? linkInfo["contractAddress"] : usdcInfo["contractAddress"];
        const soldTokenAbi = (this.state.tokenForSale == 0) ? linkInfo["abi"] : usdcInfo["abi"];
        
        const tx : any = await approve(amountSoldTokenStr, simpleSwapInfo["contractAddress"], soldTokenContractAdress, soldTokenAbi);
        await tx.wait();
            
        const writeOptionsSwap = {
          contractAddress: simpleSwapInfo["contractAddress"],
          functionName: "swap",
          abi: simpleSwapInfo["abi"],
          params: {quantitySoldToken : amountSoldTokenStr,
                  minAmountPurchasedToken : minAmountPurchasedTokenStr, 
                  tokenForSale : this.state.tokenForSale
                  }
        };
    
        await Moralis.executeFunction(writeOptionsSwap);
        }
      }

    display = () => {
        console.log(this.state);
    }

    render() {
      return <>
              <div className="MaxSlippage-btn">
                <View >
                <MaxSlippage maxSlippage={this.state.maxSlippage} handleChange={async(event : any) => {await this.handleChange(event);
                                                                    await this.changeMinAmountReceived()}}/>                     
                </View>
              </div>

              <br/>
              <br/>

              <div className="SellForm">
                < this.state._sellForm  name={this.state.tokenForSale == 0 ? "amountLink" : "amountUsdc" } amount={this.state.tokenForSale == 0 ? 
                            this.state.amountLink : this.state.amountUsdc} 
                            tokenForSale = {this.state.tokenForSale} handleChange={async(event : any) =>
                            {await this.handleChange(event); await this.changeInput(event); await this.changeMinAmountReceived() }}/>
              </div>

              <div className="Switch-btn">
                <View style={[{ width: 100}]}>
                  <Button title="Switch"  color="#02882f" onPress={async () =>{ await this.changeForms(); await this.changeMinAmountReceived(); }} />
                </View>
              </div> 

              <div className="BuyForm">                                  
                < this.state._buyForm  name={this.state.tokenForSale == 0 ? "amountUsdc"  : "amountLink" } amount={this.state.tokenForSale == 0 ? 
                this.state.amountUsdc : this.state.amountLink} handleChange={async(event : any) =>
                {this.handleChange(event); this.changeInput(event); this.changeMinAmountReceived()}}/>
              </div>

              <div className="Swap-btn">                                  
                <Button title="Swap"  color="#02882f" onPress={this.swap}/>
              </div> 

              <View style={[{ width: "10%", margin: 0, backgroundColor: "red" }]}>
                <Button title="show state in console"  color="#02882f" onPress={this.display}/>
              </View>
                  
              <div className="Min-amount-received"> 
                  Minimum amount received: {this.state.minAmountReceived}
              </div>
            </>
    }
  }


  export default Swap;