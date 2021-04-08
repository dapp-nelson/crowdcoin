// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }
    
    address public manager;
    uint public minimumContribution;
    Request[] public requests;    
    mapping(address => bool) public approvers;
    mapping(uint => address) public approversVoted;
    uint public approversCount;
    
    
    modifier onlyManager() {
        require(msg.sender == manager, "Permission denied.");
        _;
    }
    
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution, "Valor enviado menor que o valor minimo de contribuicao");
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address payable recipient) public onlyManager {
        Request memory request = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(request);
    }
    
    function approveRequest(uint index) public {
        require(approvers[msg.sender], "Voca nao tem permissao para aprovar o projeto.");
        require(!(approversVoted[index] == msg.sender), "Voce ja aprovou.");
        

        requests[index].approvalCount++;
        approversVoted[index] = msg.sender;
        
    }
    
    function finalizeRequest(uint index) public onlyManager {
        Request storage request = requests[index];
        require(!request.complete, "Campaign has been finalized.");
        require(request.approvalCount > (approversCount / 2), "Request not approved");
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint minimum, uint balance, 
                                                uint requestsSize, uint approversSize, address managerAdress){
        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
    function getAllRequests() public view returns (Request[] memory) {
        return requests;
    }
}