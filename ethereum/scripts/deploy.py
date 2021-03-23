from brownie import TimeCapsule, accounts

def main():
    acct = accounts.load('meta')
    TimeCapsule.deploy({'from': acct})