/**
 * Direccion de la mesa 1 (VotingTableContract) en la blockchain. Se usa para conectarse y llamar funciones o variables del contrato.
 */
export const TODO_LIST_ADDRESS_TABLE = '0x90E3A53d5e4a1D94039a3A645B22f8AA7958b571';

/**
 * Direccion de la mesa 2 (VotingTableContract) en la blockchain. Se usa para conectarse y llamar funciones o variables del contrato.
 */
export const TODO_LIST_ADDRESS_TABLE2 = '0x3358af02150DE84AED3f3E08B853B09C03fE4dd0';

/**
 * ABI del contrato VotingTableContract. Es empleado por javascript para poder conocer la estructura del contrato en la blockchain y asi interactuar con el.
 */
export const TODO_LIST_ABI_TABLE = [
  {
    "inputs": [
      {
        "name": "_tableNum",
        "type": "uint256"
      },
      {
        "name": "_adrElectoralProcessContract",
        "type": "address"
      },
      {
        "name": "_addressTokens",
        "type": "address"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "UnregisteredCandidate",
    "type": "event",
    "signature": "0xf579dbb6e4be5939a7ae86a0dc1ac6436554e30ca825a7a269a82edb0de345c0"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "SavedVote",
    "type": "event",
    "signature": "0x29589735489a09ac9d29c20d0c9e6cc14b0ac1852d8f2b205efe8cd4d4ecd937"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "AuthorizedVote",
    "type": "event",
    "signature": "0xa17cd5be83455be7b4647b2f08a5d0e557c4a32296c60b33b7b67fc15740265d"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "authorize",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xababa4a7"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "enablePublicScrutiny",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x5649a3dc"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "startCounting",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x38c48433"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_adrCandidate",
        "type": "address"
      },
      {
        "name": "_nameCandidate",
        "type": "string"
      },
      {
        "name": "_votingCardNumber",
        "type": "uint256"
      }
    ],
    "name": "registerCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x4978c68e"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "enableRecordModeCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf443ceaa"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "disableRecordModeCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xb1dc9324"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_adrCandidate",
        "type": "address"
      }
    ],
    "name": "voting",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x8d5c9680"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTableNumber",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc7e72b83"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_index",
        "type": "uint8"
      }
    ],
    "name": "getCandidateInfo",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x5e80550b"
  }
]
