from scripts.helpful_scripts import get_account
from brownie import SimpleSwap, interface 


def main():
    account = get_account(index=None) #index=None for deployment on a public blockchain
    simple_swap = SimpleSwap.deploy({"from": account})

    link = interface.IERC20("0xa36085F69e2889c224210F603D836748e7dC0088")
    link.approve(simple_swap.address, 2000000000000000000, {"from" : account})
    
    usdc = interface.IERC20("0xb7a4F3E9097C08dA09517b5aB877F7a917224ede")
    usdc.approve(simple_swap.address, 14000000, {"from" : account})


    simple_swap.initiatePool(2000000000000000000, 14000000, {"from" : account})
