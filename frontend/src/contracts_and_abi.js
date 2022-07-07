const simpleSwapInfo = {
    "contractAddress" : "0x5fB96EBCf0190F6c2bDa4A383c88639e62C815a3",
    "abi" : require("./0x5fB96EBCf0190F6c2bDa4A383c88639e62C815a3.json")["abi"]
}

const lpSimpleSwapInfo = { contractAddress : "0xDc93c3C023369CD773CF7007e4587C8eb597D2Ce",
                    abi : require("./IERC20.json")["abi"]};

const usdcInfo = { contractAddress : "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede",
                    abi : require("./IERC20.json")["abi"]};


const linkInfo = { contractAddress : "0xa36085F69e2889c224210F603D836748e7dC0088",
                    abi : require("./IERC20.json")["abi"]};


export {simpleSwapInfo, lpSimpleSwapInfo,  usdcInfo, linkInfo};