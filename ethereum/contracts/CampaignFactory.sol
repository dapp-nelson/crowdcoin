// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CampaignFactory{
    Campaign[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(Campaign[] memory){
        return deployedCampaigns;
    }
}