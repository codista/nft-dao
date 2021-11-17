export const NFTEXP_CONTRACT_ADDRESS="0x4d3b7cE1390725D443aE0bb4333240504b4DEeAa";
export const NFTEXP_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "oracle",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "jobid",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkFulfilled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "JoinDao",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_EVAL_PAYMENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "appraisal_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "USDValue",
          "type": "uint256"
        }
      ],
      "name": "SubmitAppraisalVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "NFTContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "NFTID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "nftMarketplace",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "minVoters",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "minExpertiseLevel",
          "type": "uint256"
        }
      ],
      "name": "SubmitNFTForAppraisal",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_oracle",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_oracleJobId",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "appraisal_voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "appraisal_votes",
      "outputs": [
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "appraised_value_usd",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes1",
          "name": "b",
          "type": "bytes1"
        }
      ],
      "name": "char",
      "outputs": [
        {
          "internalType": "bytes1",
          "name": "c",
          "type": "bytes1"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "experts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        },
        {
          "internalType": "enum DecentralizedNFTDao.ExpertEvaluationStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "initialized",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        }
      ],
      "name": "fulfillExpertiseScore",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "appraisal_id",
          "type": "uint256"
        }
      ],
      "name": "getAppraisalVotes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "appraised_value_usd",
              "type": "uint256"
            }
          ],
          "internalType": "struct DecentralizedNFTDao.Vote[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAppraisalsForExpert",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "appraisal_id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nft_id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nft_contract",
              "type": "address"
            },
            {
              "internalType": "enum DecentralizedNFTDao.NFTAppraisalStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "request_time",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "minVoters",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "minExpertiseLevel",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paymentEth",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "nftMarketplace",
              "type": "string"
            }
          ],
          "internalType": "struct DecentralizedNFTDao.NFTApprisalRequest[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "expert",
          "type": "address"
        }
      ],
      "name": "getExpertSCore",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "expert",
          "type": "address"
        }
      ],
      "name": "getExpertStatus",
      "outputs": [
        {
          "internalType": "enum DecentralizedNFTDao.ExpertEvaluationStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUserAppraisalRequests",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "appraisal_id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nft_id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nft_contract",
              "type": "address"
            },
            {
              "internalType": "enum DecentralizedNFTDao.NFTAppraisalStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "request_time",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "minVoters",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "minExpertiseLevel",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paymentEth",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "nftMarketplace",
              "type": "string"
            }
          ],
          "internalType": "struct DecentralizedNFTDao.NFTApprisalRequest[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "req_id_to_exp",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "x",
          "type": "address"
        }
      ],
      "name": "toAsciiString",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "user_appraisals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];