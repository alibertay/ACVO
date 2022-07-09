// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";

contract ACVO {
    address payable public Owner;
    BallotPaper public VotingContract;
    mapping(uint256 => address) ContractID;

    constructor(){
        Owner = payable(msg.sender);
    }

    function CreateBallot(uint256 _ID) payable public {
        require(msg.value >= 0.0005 ether, "Insufficient balance");
        VotingContract = new BallotPaper();
        ContractID[_ID] = address(VotingContract);
        VotingContract.TransferOwner(msg.sender);
 }

    function SearchForVotingContract(uint256 _ID) public view returns (address){
        return ContractID[_ID];
    }

    function Withdraw(address _ToAddress) public{
        require(_ToAddress == Owner, "This function is owner only.");
        Owner.transfer(address(this).balance);
    }

    function deposit() public payable {}

}