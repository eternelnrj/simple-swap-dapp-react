from brownie import accounts, config

def get_account(index=None):
    if index:
        return accounts[index]

    return accounts.add(config["wallets"]["from_key"])
