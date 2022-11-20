# Voting Dapp

The project was created with the truffle react box: `truffle unbox react` which created 2 main folders:

## Truffle folder

It contains the Voting contract and tests which were taken from the correction.
Tests were not working:
```
1 failing

  1) Contract: Voting
       Add Proposal Phase
         Multiple Proposal pass : concat:

      AssertionError: expected 'GENESIS' to equal 'proposalVoter1'
      + expected - actual

      -GENESIS
      +proposalVoter1
```
and had been fixed in this project.

The Voting contract had a DOS gas limit vulnerability in the tallyVotes function in the for loop. Indeed, an attacker could have added many proposals in order to reach the gas limit of a block and blocked the contract.
This have been fixed by moving the computation of the winner in the setVote method. At each vote we recompute the winningProposalId wihout having to do a loop.

### Requirements

Node > 16
Truffle
Ganache

### Install dependencies
`yarn install`

### Deploy contract

Run `ganache` to start a local blockchain

`truffle migrate --network development --reset` to deploy locally

or

`truffle migrate --network goerli --reset` to deploy on goerli

## Client folder

It contains the front end application written in React with web3js dependency to interact with our deployed Voting smart contract.

### Install dependencies

`yarn install`

### Run server

`yarn start`

### Demo

https://www.loom.com/share/37f9afd12b6b480a802fb0d4f75f4907




