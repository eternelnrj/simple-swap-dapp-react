// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import  {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}


contract LpSimpleSwap is ERC20, ERC20Burnable {
    address parentAddress;

   constructor(address _parentAddress) ERC20("Lp Simple Swap", "LpSimpleSwap")  {
        parentAddress = _parentAddress;
    }

    function mint(uint256 quantity) public onlyParent {
        _mint(tx.origin, quantity);
    }

    function burn(uint256 quantity) public override onlyParent {
        burnFrom(tx.origin, quantity);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }

    modifier onlyParent {
        require(msg.sender == parentAddress);
        _;
    }
}


contract SimpleSwap is Ownable{
    using SafeMath for uint256;

    enum Token{Link, USDC}

    address addressLink = 0xa36085F69e2889c224210F603D836748e7dC0088;   //Kovan address      //0x01BE23585060835E02B77ef475b0Cc51aA1e0709; rinkeby
    address addressUSDC = 0xb7a4F3E9097C08dA09517b5aB877F7a917224ede;    //Kovan address            //0xeb8f08a975Ab53E34D8a0330E0D34de942C95926; rinkeby

    uint256 public totalAvailableLink = 0;      //18 decimals
    uint256 public totalAvailableUSDC = 0;      //6 decimals

    uint256  public totalLpTokens = 0;           //6 decimals

    uint256 public FEE = 3 * 10 ** 3;         //6 decimals

    bool isPoolInitialized = false;

    LpSimpleSwap lpTokens;

    function initiatePool(uint256 amountLinkToSupply, uint256 amountUsdcToSupply) public onlyOwner {
        require(!isPoolInitialized, "The pool was already initialized");
        isPoolInitialized = true;

        lpTokens = new LpSimpleSwap(address(this));

        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        require(Link.transferFrom(msg.sender, address(this), amountLinkToSupply), "Link amount unavailable.");
        require(USDC.transferFrom(msg.sender, address(this), amountUsdcToSupply), "USDC amount unavailable.");

        totalAvailableLink = totalAvailableLink.add(amountLinkToSupply);
        totalAvailableUSDC = totalAvailableUSDC.add(amountUsdcToSupply);

        totalLpTokens = amountUsdcToSupply;
        lpTokens.mint(totalLpTokens);
    }

    function swap(uint256 quantitySoldToken, uint256 minAmountPurchasedToken, Token tokenForSale) public {
        require(isPoolInitialized, "The pool should be initialized first.");
        require(quantitySoldToken > 0, "The amount to sell should be strictly bigger than 0.");
        uint256 amountPurchasedToken = getAmountPurchasedToken(quantitySoldToken, tokenForSale);
        require(amountPurchasedToken >= minAmountPurchasedToken, "The amount of purchased token is lower than required.");

        IERC20 soldToken;
        IERC20 boughtToken;

        if (tokenForSale == Token.Link) {
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

        assert(boughtToken.transfer(msg.sender, amountPurchasedToken));
        require(soldToken.transferFrom(msg.sender, address(this), quantitySoldToken), "Transfer of the amount of token you want to sell failed.");
    }

    function supply(uint256 amountLpTokens) public {
        require(isPoolInitialized, "The pool should be initialized first.");
        require(amountLpTokens > 0, "The amount of supplied lp tokens should be > 0.");
        (uint256 amountLinkPerLpToken, uint256 amountUsdcPerLpToken) = getLpTokenPrice();

        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        uint256 amountLinkToSupply = amountLinkPerLpToken.mul(amountLpTokens).div(10 ** 6); // 18 decimals
        uint256 amountUSDCToSupply = amountUsdcPerLpToken.mul(amountLpTokens).div(10 ** 6); // 6 decimals

        totalAvailableLink = totalAvailableLink.add(amountLinkToSupply);
        totalAvailableUSDC = totalAvailableUSDC.add(amountUSDCToSupply);

        totalLpTokens = totalLpTokens.add(amountLpTokens);

        lpTokens.mint(amountLpTokens);

        require(Link.transferFrom(msg.sender, address(this), amountLinkToSupply), "Link amount unavailable.");
        require(USDC.transferFrom(msg.sender, address(this), amountUSDCToSupply), "USDC amount unavailable.");
    }

    function withdraw(uint256 amountLpTokens) public {
        require(isPoolInitialized, "The pool should be initialized first.");
        require(amountLpTokens > 0, "The amount of requested lp tokens should be > 0.");
        require(lpTokens.balanceOf(msg.sender) >= amountLpTokens, "You don't have enough LP tokens.");
        
        (uint256 amountLinkPerLpToken, uint256 amountUSDCPerLpToken)  = getLpTokenPrice();

        uint256 amountLinkToWithdraw = amountLinkPerLpToken.mul(amountLpTokens).div(10 ** 6);
        uint256 amountUSDCToWithdraw = amountUSDCPerLpToken.mul(amountLpTokens).div(10 ** 6);

        totalAvailableLink = totalAvailableLink.sub(amountLinkToWithdraw);
        totalAvailableUSDC = totalAvailableUSDC.sub(amountUSDCToWithdraw);

        totalLpTokens = totalLpTokens.sub(amountLpTokens);

        lpTokens.burn(amountLpTokens);

        IERC20 Link = IERC20(addressLink);
        IERC20 USDC = IERC20(addressUSDC);

        assert(Link.transfer(msg.sender, amountLinkToWithdraw));
        assert(USDC.transfer(msg.sender, amountUSDCToWithdraw));
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Link - USDC                      // 6 decimals
    function getAmountPurchasedToken(uint256 amountSoldTokens, Token tokenForSale) internal view returns(uint256)
    {
        uint256 y = (tokenForSale == Token.Link) ? totalAvailableUSDC : totalAvailableLink;
        uint256 x = (tokenForSale == Token.Link) ? totalAvailableLink : totalAvailableUSDC;

        uint256 C = totalAvailableUSDC.mul(totalAvailableLink);         // 24 decimals
        uint256 amountPurchasedTokens = y.sub(C.div(x.add(amountSoldTokens))); // 6 or 18 decimals

        return amountPurchasedTokens.mul(10 ** 6 - FEE).div(10 ** 6);
    }

    function getLpTokenPrice() public view returns(uint256, uint256) 
    {
        return (totalAvailableLink.mul(10 ** 6).div(totalLpTokens), totalAvailableUSDC.mul(10 ** 6).div(totalLpTokens));
    }
}
