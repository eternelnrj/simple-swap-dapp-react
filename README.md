#### Decentralized AMM App.
A simple application that allows exchange Link for USDC and vice-versa as well as provide liquidity to receive fees from swaps. The smart contracts are written in solidity, and for the frontend we use React/javascript combined with Moralis to interact with smart contracts.


#### Launch.
One needs to create an account on `https://moralis.io/` and create a new dapp with `Kovan` testnet enabled. Use the
server url and app id of the moralis dapp to create a `.config.json` file with content
`{"serverUrl" : "YOUR_URL", "appId" : "YOUR_APP_ID"}` inside the `frontend` folder. You can then launch the dapp from
`frontend` folder with the command `npm start`.


####  Modifications
To deploy a modified version of the Smart Contract with `brownie` you need to: 

 1) Add `.env` file containing 
`export PRIVATE_KEY=YOUR_PRIVATE_KEY`
`export WEB3_INFURA_PROJECT_ID=YOUR_INFURA_PROJECT_ID`;

2) modify the source code `SimpleSwap.sol`  in the `contracts` folder;

3) `brownie compile`;

4) `brownie run ./scripts/deploy_scripts.py" --network network_name`;

5) Update `contracts_and_abi.js` in the frontend folder using the new contract address and abi.