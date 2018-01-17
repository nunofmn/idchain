# IDChain
> _Proof-of-concept._  
>  A web-of-trust system using Ethereum’s smart contracts.   

Read more about this project in ["Secure DHT with Blockchain technology" document](https://github.com/nunofmn/thesis) .

This project is composed by two main components:
* **IDChain API** - an HTTP RESTful API for easing access to the smart contract functionalities;
* **IDChain App** - a web app for interacting with the system.

## Getting started
### API
First, it is necessary to start an Ethereum client and deploy the contract. 

This project has the following external dependencies:
* [Truffle](https://github.com/trufflesuite/truffle)  - for managing and deploying the smart contracts;
* [Ganache](https://github.com/trufflesuite/ganache-cli) - full Ethereum client simulator.(for development purposes);
* [PostgreSQL](https://www.postgresql.org/) 

```shell
npm install -g truffle ganache-cli

truffle deploy
npm api:start
```

### App

```shell
cd client/
npm start
```

## Contributing
If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Licensing
The code in this project is licensed under MIT license.
