import * as React from 'react'
import {Button, View} from 'react-native';
import Moralis from "moralis";

import {simpleSwapInfo, lpSimpleSwapInfo} from "./contracts_and_abi.js";
import {approve, getBigNumberWithDecimals} from "./secondary_functions.js";

  
class Withdraw extends React.Component<any, any>{
    constructor(props : any) {
        super(props);
        this.state = {
          amountLpTokens : 0.0,
        }
      }

    
    handleChange = async (event : any) => {
      await this.setState({...this.state, [event.target.name] : event.target.value});
    }

    withdraw = async () => {
        const amountLpTokens = this.state.amountLpTokens;
        const amountLpTokensWithDecimalsStr = getBigNumberWithDecimals(amountLpTokens, 6).toString();

        const tx : any = await approve(amountLpTokensWithDecimalsStr, simpleSwapInfo["contractAddress"],
        lpSimpleSwapInfo["contractAddress"], lpSimpleSwapInfo["abi"]);
        await tx.wait(1);

        const writeOptionsWithdraw = {
          contractAddress: simpleSwapInfo["contractAddress"],
          functionName: "withdraw",
          abi: simpleSwapInfo["abi"],
          params : {amountLpTokens:amountLpTokensWithDecimalsStr}
        };
        
        await Moralis.executeFunction(writeOptionsWithdraw);
      }

    display = () => {
        console.log(this.state);
    }

    render() {
      return <>
              <div className='WitdrawForm'>

                <label> Lp tokens:
                  <input type="number" name="amountLpTokens" value={this.state.amountLpTokens} onChange={this.handleChange}/>
                </label>

                <div className="withdraw-btn">
                  <View >
                    <Button title="Withdraw"  color="#02882f" onPress={this.withdraw}/>
                  </View>
                </div>

              </div>
                <View style={[{ width: "10%", margin: 0, backgroundColor: "red" }]}>
                  <Button title="show state (withdraw) in console"  color="#02882f" onPress={this.display}/>
                </View>
        </>
    }
  }
  


  export default Withdraw;


