const simpleSwapInfo = {
    "contractAddress" : "0xD1cF252059Eb6d5AfA46224D4841764bC10E790a",
    "abi" : require("./0xD1cF252059Eb6d5AfA46224D4841764bC10E790a.json")["abi"]
}

const lpSimpleSwapInfo = { contractAddress : "0x2Fb9c80b4f37e3ed8CfF3E9F97fB6f765F5eA6B1",
                    abi : require("./IERC20.json")["abi"]};

const usdcInfo = { contractAddress : "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede",
                    abi : require("./IERC20.json")["abi"]};


const linkInfo = { contractAddress : "0xa36085F69e2889c224210F603D836748e7dC0088",
                    abi : require("./IERC20.json")["abi"]};


export {simpleSwapInfo, lpSimpleSwapInfo,  usdcInfo, linkInfo};