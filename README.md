# Rock-Paper-Scissors (RPS) Game on Blockchain

Welcome to the Rock-Paper-Scissors (RPS) game implemented on the blockchain! This project allows players to participate in an online RPS game using smart contracts on the Ethereum blockchain.

## Overview

The game involves two players interacting via a smart contract. It supports the following functionalities:

- **Connect Wallet**: Before starting the game, players need to connect their wallets to interact with the smart contract.

- **Create Game or Join a Game**:
  - **Create Game**: As the first player, you can create a game by selecting your move (Rock, Paper, Scissors, etc.), providing a salt to create a commitment for your move, entering your opponent's address, and specifying the stake amount.
  - **Join a Game**: The second player can join an existing game by providing the contract address created by the first player. They can then make their move, match the stake amount, and wait for the first player's reentry of their move.

- **Game Flow**:
  1. The first player enters their move, creates a commitment using a salt, and specifies the opponent's address and stake amount.
  2. The second player joins the game, matches the stake amount, and makes their move.
  3. The first player reenters their move.
  4. The smart contract verifies if the reentered move matches the one entered during the creation.
  5. If the moves match, the smart contract determines the winner, and the entire stake amount goes to the winner.
  
- **Timeouts**:
  - Timeout occurs if a player doesn't make their move within 5 minutes. This feature prevents delays and ensures active participation.

## Getting Started

To run the game:
1. Clone this repository.
2. Install the necessary dependencies.
3. Run the application on a development environment.

Ensure you have a compatible Ethereum wallet (like MetaMask) to connect and interact with the smart contract.

## Development Details

The game is built using [insert technologies/languages/frameworks used - e.g., Solidity, React, Ethereum, etc.].

## Contributions

Contributions and improvements to the game are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the [insert license type].
