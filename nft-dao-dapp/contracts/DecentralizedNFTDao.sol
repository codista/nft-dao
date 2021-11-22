// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";



contract DecentralizedNFTDao is ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;

    constructor(address oracle, string memory jobid) ConfirmedOwner(msg.sender) {
        _oracle = oracle;
        _oracleJobId = jobid;
        setPublicChainlinkToken();
    }

    uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
    uint256 constant public MIN_EVAL_PAYMENT = 1*(10**15);

    enum ExpertEvaluationStatus{ None,Pending, Resolved, Failed}

    enum NFTAppraisalStatus{ Open, Resolved, Failed }

    struct Vote {
        address voter;
        uint256 appraised_value_usd;
    }

    struct Expert {
        uint256                 score;
        ExpertEvaluationStatus  status;
        bool                    initialized;
    }

    struct NFTApprisalRequest {
        uint256                 appraisal_id;
        uint256                 nft_id;
        address                 nft_contract;
        NFTAppraisalStatus      status;
        uint256                 request_time;
        uint8                   minVoters;
        uint256                 minExpertiseLevel;
        uint256                 paymentEth;
        string                  nftMarketplace;
    }

    mapping(address => Expert) public experts;

    mapping(address => uint256[]) public user_appraisals;

    mapping(uint256 => mapping(address=>bool)) public appraisal_voters;

    mapping(uint256 => Vote[]) public appraisal_votes;

    mapping(bytes32 => address) public req_id_to_exp;
    
    NFTApprisalRequest[] appraisals;
    

    //chainlink connection
    address public _oracle;
    string public _oracleJobId;
    
   

    //external functions
    //------------------------------

    function SubmitNFTForAppraisal(     address NFTContract,
                                        uint256 NFTID,
                                        string memory nftMarketplace,
                                        uint8 minVoters,
                                        uint256 minExpertiseLevel)  public payable 
    {
        //string memory key = _getNFTKey(NFTContract, NFTID);
        //equire(appraisals[key].NFTAppraisalStatus!=NFTAppraisalStatus.Pending,"This NFT is currently being appraised and can not be resubmitted");
        require(msg.value>=MIN_EVAL_PAYMENT,"Appraisal request does not include the minimal Eth payment required");
       

        
        appraisals.push(NFTApprisalRequest(appraisals.length,
                                            NFTID,
                                            NFTContract,
                                            NFTAppraisalStatus.Open,
                                            block.timestamp,
                                            minVoters,
                                            minExpertiseLevel,
                                            msg.value,
                                            nftMarketplace));
        user_appraisals[msg.sender].push(appraisals.length - 1);
    }

    function getExpertStatus(address expert) public view returns (ExpertEvaluationStatus)
    {
        return (experts[expert].initialized)?experts[expert].status: ExpertEvaluationStatus.None;
    }

    function getExpertSCore(address expert) public view returns (uint256)
    {
        return (experts[expert].initialized)?experts[expert].score: 0;
    }
    
    function fulfillExpertiseScore(bytes32 _requestId, uint256 score)
     public
        recordChainlinkFulfillment(_requestId)
    {
        //emit RequestExpertiseScoreFulfilled(_requestId, _nftvalue);
        
        experts[req_id_to_exp[_requestId]].score = score;
        experts[req_id_to_exp[_requestId]].status = ExpertEvaluationStatus.Resolved;
    }

    function getAppraisalStatus(uint256 appraisal_id) public view returns (NFTAppraisalStatus)
    {
        require(appraisal_id<appraisals.length,"apriasal ID does not exist");
        return appraisals[appraisal_id].status;
    }

    function getUserAppraisalRequests() public view returns(NFTApprisalRequest[] memory)
    {
        NFTApprisalRequest[] memory filtered;
        if (user_appraisals[msg.sender].length!=0)
        {
            filtered =new NFTApprisalRequest[](user_appraisals[msg.sender].length);
            for (uint256 i=0; i< user_appraisals[msg.sender].length;i++)
            {
                filtered[i]=appraisals[user_appraisals[msg.sender][i]];
            }
        }
            
        return filtered;
    }

    //get expert relevant open appraisals
    function getAppraisalsForExpert() public view onlyExpert returns (NFTApprisalRequest[] memory)
    {
        
        Expert memory expData = experts[msg.sender];
        require(expData.initialized!=false,"address not registered as expert");
        require(expData.status==ExpertEvaluationStatus.Resolved,"Expert score not finalized yet");
        NFTApprisalRequest[] memory filtered;
        uint256 count=0;
        for (uint256 i=0;i<appraisals.length;i++) {
            if (appraisals[i].minExpertiseLevel<=expData.score && appraisals[i].status == NFTAppraisalStatus.Open) {
                    count++;
            }
        }
        if (count>0) {
            filtered  = new NFTApprisalRequest[](count);
            count=0;
            for (uint256 i=0;i<appraisals.length;i++) {
                if (appraisals[i].minExpertiseLevel<=expData.score && appraisals[i].status == NFTAppraisalStatus.Open) {
                        filtered[count]=appraisals[i];
                        count++;
                }
            }
        }
        return filtered;
    }

    function getExpertVote(uint256 appraisal_id,address expert_address) public view returns (uint256) {
        require(appraisal_id<appraisals.length,"apriasal ID does not exist");
        if (appraisal_voters[appraisal_id][expert_address]==false) return 0;
        uint256 value=0;
        for (uint i=0; i<appraisal_votes[appraisal_id].length;i++) {
            if (appraisal_votes[appraisal_id][i].voter==expert_address) {
                value= appraisal_votes[appraisal_id][i].appraised_value_usd;
                break;
            }
        }
        return value;
    }



    //expert Vote
    function SubmitAppraisalVote(uint256 appraisal_id,uint256 USDValue) public onlyExpert {

        require(appraisal_id<appraisals.length,"apriasal ID does not exist");


        NFTApprisalRequest memory appr = appraisals[appraisal_id];
        Expert memory expr = experts[msg.sender];
        require((appr.status==NFTAppraisalStatus.Open) && (appr.minExpertiseLevel<expr.score),"appraisal not pending or expert level not enough to vote");
        require(appraisal_voters[appraisal_id][msg.sender]==false,"already voted");


        appraisal_voters[appraisal_id][msg.sender]=true;
        appraisal_votes[appraisal_id].push(Vote(msg.sender,USDValue));

        //handle resolution (should be handled externally later when time limit is added)
        if (appraisal_votes[appraisal_id].length>=appraisals[appraisal_id].minVoters) {
            appraisals[appraisal_id].status=NFTAppraisalStatus.Resolved;
        }
        
    }

    

    //join Dao
    function JoinDao() public {
        require(experts[msg.sender].initialized==false || experts[msg.sender].status==ExpertEvaluationStatus.Pending,"Expert is already a member");
        experts[msg.sender]=Expert(0,ExpertEvaluationStatus.Pending,true);
        bytes32 reqId = requestExpertiseScore(msg.sender);
        req_id_to_exp[reqId]=msg.sender;
    }

    function getAppraisalVotes(uint256 appraisal_id) public view onlyAppraisalCreator(appraisal_id) returns (Vote[] memory) {
        require(appraisal_id<appraisals.length,"apriasal ID does not exist");
        return appraisal_votes[appraisal_id];
    }


    //internal functions
    //------------------------------

    function _handleAppraisalResolution(uint256 appraisal_id) internal {
        NFTApprisalRequest memory appr = appraisals[appraisal_id];
        
        if (appraisal_votes[appraisal_id].length>=appr.minVoters ) {
            appr.status=NFTAppraisalStatus.Resolved;
            _handleVotePayout(appr);
        }

    }

    

    function _handleVotePayout(NFTApprisalRequest memory appr) internal {
        //TO DO: dittribute payout between voters 
    }

    //function _addressToString(address addr) internal pure returns (string memory)
    //{
    //    return string(abi.encodePacked(addr));
    //}

    function requestExpertiseScore(address expert)
        internal returns (bytes32)
        
    {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_oracleJobId), address(this), this.fulfillExpertiseScore.selector);
        req.add("expertAddress", toAsciiString(expert));
        return sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
        //return "fff";
    }
    
    //function _calculateNFTAppraisal()

    //pay voters



    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
        return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
        result := mload(add(source, 32))
        }
    }

    

   modifier onlyAppraisalCreator(uint256 appraisal_id) {
       bool isCreator=false;
       for (uint256 i=0;i<user_appraisals[msg.sender].length;i++) {
           if (user_appraisals[msg.sender][i]==appraisal_id) {
               isCreator=true;
               break;
           }
       }
      require(isCreator == true,"only the creator of an appraisal can call this function");
      _;
   }

   modifier onlyExpert() {
      require(experts[msg.sender].initialized == true && experts[msg.sender].status==ExpertEvaluationStatus.Resolved,"Only approved experts can call this function");
      _;
   }

    function toAsciiString(address x) public pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(abi.encodePacked("0x",s));
    }


    function char(bytes1 b) public pure returns (bytes1 c) {

        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

   

}