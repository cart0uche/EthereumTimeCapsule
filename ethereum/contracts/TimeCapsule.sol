// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;


contract TimeCapsule {
       
    struct Capsule { 
        address sender;
        string message;
        uint256 date;
        bool visible;
    } 
    
    Capsule[] private capsules;

    constructor () {
    }
    
    function sendCapsule(string memory message, uint256 dateTimeRecoverMessage) external {
        Capsule memory newCapsule = Capsule(msg.sender, message, dateTimeRecoverMessage, false);
        capsules.push(newCapsule);
    }
   
    function getCapsules() external view returns(Capsule[] memory){
        Capsule[] memory capsulesAvailable = new Capsule[](capsules.length);
 
        for(uint256 i=0; i < capsules.length; i++)
        {
            if (capsules[i].date <= block.timestamp) {   
                capsulesAvailable[i] = Capsule(capsules[i].sender, capsules[i].message, capsules[i].date, true);
            }
            else {
                capsulesAvailable[i] = Capsule(capsules[i].sender, "", capsules[i].date, false);
            }
        }

        return capsulesAvailable;
    }     
}