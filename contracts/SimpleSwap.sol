// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract LpSimpleSwap is ERC20 {
    constructor() ERC20("Lp Simple Swap", "LpSimpleSwap") {
    }

    function mint(uint256 quantity) public {
        _mint(tx.origin, quantity);
    }

    function burn(uint256 quantity) public {
        _burn(tx.origin, quantity);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }
}



contract SimpleSwap is Ownable{
    using SafeMath for uint256;

    enum Tokens{Link, USDC}

    address addressLink = 0xa36085F69e2889c224210F603D836748e7dC0088;   //Kovan address      //0x01BE23585060835E02B77ef475b0Cc51aA1e0709; rinkeby
    address addressUSDC = 0xb7a4F3E9097C08dA09517b5aB877F7a917224ede;    //Kovan address            //0xeb8f08a975Ab53E34D8a0330E0D34de942C95926; rinkeby

    uint256 public totalAvailableLink = 0;      //18 decimals
    uint256 public totalAvailableUSDC = 0;      //6 decimals

    uint256  public totalLpTokens = 0;           //6 decimals

    uint256 public FEE = 3 * 10 ** 3;         //6 decimals

    bool isPoolInitiated = false;

    LpSimpleSwap lpTokens = new LpSimpleSwap();

 

    function initiatePool(uint256 amountLinkToSupply, uint256 amountUsdcToSupply) public onlyOwner {
        require(!isPoolInitiated, "The pool was already initiated");
        isPoolInitiated = true;
        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        require(Link.transferFrom(msg.sender, address(this), amountLinkToSupply), "Link amount unavailable.");
        require(USDC.transferFrom(msg.sender, address(this), amountUsdcToSupply), "USDC amount unavailable.");

        totalAvailableLink = totalAvailableLink.add(amountLinkToSupply);
        totalAvailableUSDC = totalAvailableUSDC.add(amountUsdcToSupply);


        totalLpTokens = amountUsdcToSupply;
        //userToAmountLpTokens[msg.sender] = userToAmountLpTokens[msg.sender].add(totalLpTokens);
        lpTokens.mint(totalLpTokens);
    }


    // Basic check: Done
    function swap(uint256 quantitySoldToken, uint256 minAmountPurchasedToken, Tokens tokenForSale) public {
        require(isPoolInitiated, "The pool should be initiated first.");
        uint256 amountPurchasedToken = getAmountPurchasedToken(quantitySoldToken, tokenForSale);
        require(amountPurchasedToken >= minAmountPurchasedToken, "The amount of purchased token is lower than required.");

        IERC20 soldToken;
        IERC20 boughtToken;

        if (tokenForSale == Tokens.Link) {
            totalAvailableLink  = totalAvailableLink.add(quantitySoldToken);
            totalAvailableUSDC = totalAvailableUSDC.sub(amountPurchasedToken);

            soldToken = IERC20(addressLink);
            boughtToken = IERC20(addressUSDC);
        }

        else {
            totalAvailableLink = totalAvailableLink.sub(amountPurchasedToken);
            totalAvailableUSDC = totalAvailableUSDC.add(quantitySoldToken);

            soldToken = IERC20(addressUSDC); 
            boughtToken = IERC20(addressLink);
        }
        
        require(boughtToken.transfer(msg.sender, amountPurchasedToken), "Token amount unavailable.");
        require(soldToken.transferFrom(msg.sender, address(this), quantitySoldToken), "Token amount unavailable.");

    }

    // Basic check: Done
    function supply(uint256 amountLpTokens) public {
        require(isPoolInitiated, "The pool should be initiated first.");
        require(amountLpTokens > 0, "The amount of supplied lp tokens should be > 0.");
        (uint256 amountLinkPerLpToken, uint256 amountUsdcPerLpToken) = getLpTokenPrice();

        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        uint256 amountLinkToSupply = amountLinkPerLpToken.mul(amountLpTokens).div(10 ** 6); // 18 decimals
        uint256 amountUSDCToSupply = amountUsdcPerLpToken.mul(amountLpTokens).div(10 ** 6); // 6 decimals

        totalAvailableLink = totalAvailableLink.add(amountLinkToSupply);
        totalAvailableUSDC = totalAvailableUSDC.add(amountUSDCToSupply);

        totalLpTokens = totalLpTokens.add(amountLpTokens);

        //userToAmountLpTokens[msg.sender] = userToAmountLpTokens[msg.sender].add(amountLpTokens);
        lpTokens.mint(amountLpTokens);

        require(Link.transferFrom(msg.sender, address(this), amountLinkToSupply), "Link amount unavailable.");
        require(USDC.transferFrom(msg.sender, address(this), amountUSDCToSupply), "USDC amount unavailable.");
    }


    // Basic check: Done
    function withdraw(uint256 amountLpTokens) public {
        require(isPoolInitiated, "The pool should be initiated first.");
        require(amountLpTokens > 0, "The amount of requested lp tokens should be > 0.");
        require(lpTokens.balanceOf(msg.sender) >= amountLpTokens, "You don't have enough LP tokens.");

        
        (uint256 amountLinkPerLpToken, uint256 amountUSDCPerLpToken)  = getLpTokenPrice();

        uint256 amountLinkToWithdraw = amountLinkPerLpToken.mul(amountLpTokens).div(10 ** 6);
        uint256 amountUSDCToWithdraw = amountUSDCPerLpToken.mul(amountLpTokens).div(10 ** 6);

        totalAvailableLink = totalAvailableLink.sub(amountLinkToWithdraw);
        totalAvailableUSDC = totalAvailableUSDC.sub(amountUSDCToWithdraw);

        totalLpTokens = totalLpTokens.sub(amountLpTokens);

        //userToAmountLpTokens[msg.sender] = userToAmountLpTokens[msg.sender].sub(amountLpTokens);
        lpTokens.burn(amountLpTokens);


        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        require(Link.transfer(msg.sender, amountLinkToWithdraw), "Link amount unavailable.");
        require(USDC.transfer(msg.sender, amountUSDCToWithdraw), "USDC amount unavailable.");

    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Link - USDC                      // 6 decimals
    function getAmountPurchasedToken(uint256 amount, Tokens tokenForSale) internal view returns(uint256)
    {
        uint256 y = (tokenForSale == Tokens.Link) ? totalAvailableUSDC : totalAvailableLink;
        uint256 x = (tokenForSale == Tokens.Link) ? totalAvailableLink : totalAvailableUSDC;

        uint256 C = totalAvailableUSDC * totalAvailableLink;         // 24 decimals
        uint256 amountPurchasedTokens = y.sub(C.div(x + amount)); // 6 or 18 decimals

        return amountPurchasedTokens * (10 ** 6 - FEE) / 10 ** 6;
    }



    function getLpTokenPrice() public view returns(uint256, uint256) 
    {
        return (totalAvailableLink.mul(10 ** 6).div(totalLpTokens), totalAvailableUSDC.mul(10 ** 6).div(totalLpTokens));
    }


}


