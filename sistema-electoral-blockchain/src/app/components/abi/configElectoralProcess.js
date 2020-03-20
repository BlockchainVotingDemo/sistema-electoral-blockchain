/**
 * Direccion del contrato ElectoralProcessContract en la blockchain. Se usa para conectarse y llamar funciones o variables del contrato.
 */
export const TODO_LIST_ADDRESS_ELECTORAL = '0xF53d904FfD08444300cd62d6e55097eFA9E125DF';

/**
 * ABI del contrato ElectoralProcessContract. Es empleado por javascript para poder conocer la estructura del contrato en la blockchain y asi interactuar con el.
 */
export const TODO_LIST_ABI_ELECTORAL = [
  {
    "inputs": [
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
    "name": "CandidateRegistrationModeEnabled",
    "type": "event",
    "signature": "0xd3c62f8d98bc8abd02a45d86a793f33e747737aa5ededad21d9fee5db10d9bf6"
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
    "name": "CandidateRegistrationModeDisabled",
    "type": "event",
    "signature": "0xd100ed050d85998f69991d271da8f53f9a12c5a295211a378bd19d344a67eb55"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "msg",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "numVotos",
        "type": "uint256"
      }
    ],
    "name": "FinishedScrutiny",
    "type": "event",
    "signature": "0x6a3dfe903f9c9a5df1780baf9b50da5bf3931d4c189916265363bd0895430bf8"
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
    "name": "ElectoralProcessNotFinished",
    "type": "event",
    "signature": "0x2b0c11d8ab2e5974d99464518406434f8a7857affd8b65589f97cba1a8f52620"
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
    "name": "ElectoralProcessFinished",
    "type": "event",
    "signature": "0x0d500fd7c5d44a3645c2c85b7e0635e392c1a96f52c7524882081b0a9f24c352"
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
    "name": "ElectoralProcessStarted",
    "type": "event",
    "signature": "0x3b5c9b4d56176814fc6961306e2b7f853e413fb56b1db334642484ac52b2e827"
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
    "name": "PublicScrutinyEnabled",
    "type": "event",
    "signature": "0xc125050237a20bc7160947f6064102f409854377c7d40242d2a0aadf5f16dba4"
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
    "name": "VotingTableAdded",
    "type": "event",
    "signature": "0x00da1826cf662ab84ebf3a5554e103c3e093a5544c7894a9fbc46a493969fdc6"
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
    "name": "EnableRecordModeTables",
    "type": "event",
    "signature": "0xef42e83724343947fec86a621d6126bfe67edb3ddc5449c0ae67b65c17fd84a9"
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
    "name": "DisableRecordModeTables",
    "type": "event",
    "signature": "0x4d5c319f071fbd91c44ae2fa44da95e5846c16757cea943d679a05be5a502e01"
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
    "name": "RegisteredCandidate",
    "type": "event",
    "signature": "0xbcc4d26e4756748b0590c7f09ab7f7c59092c49198777bbe24f08efc1ba99568"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "enableRecordeModeCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x668fe5db"
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
    "name": "enableElectoralProcess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x55c4e440"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "endElectoralProcess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x0eac9310"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOpenElectoralProces",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8643fbd2"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_adr",
        "type": "address"
      },
      {
        "name": "_name",
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
    "name": "enableRecordModeTables",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xaf039938"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "disableRecordModeTables",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x22cabf67"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "codeTable",
        "type": "uint256"
      },
      {
        "name": "_adr",
        "type": "address"
      }
    ],
    "name": "addTable",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xeb06d900"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getNumberCandidates",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x493f584c"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "index",
        "type": "uint8"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xcde9370f"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getNumberTables",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x507bf379"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "index",
        "type": "uint8"
      }
    ],
    "name": "getTable",
    "outputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1a867b7b"
  }
]
