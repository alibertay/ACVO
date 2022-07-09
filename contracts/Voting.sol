// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotPaper {
    address payable public Owner;
    mapping(string => uint256) public VoteCount;
    mapping(address => bool) Users;
    string[] public Keys;

    constructor(){
        Owner = payable(msg.sender);
    }

    function GetKeys() public view returns(string[] memory) {
        return Keys;
    }

    function AddCandidate(string memory _Candidate) public payable {
        require(VoteCount[_Candidate] == 0, "There is already such a candidate.");
        require(msg.value >= 0.0003 ether, "To be nominated you must send at least 0.0005 ether");
        VoteCount[_Candidate] = 1;
        Users[msg.sender] = true;
        Keys.push(_Candidate);
    }

    function Vote(string memory _Candidate) public {
        require(Users[msg.sender] == false, "This address has already voted.");
        require(VoteCount[_Candidate] >= 1, "There is no such candidate.");
        VoteCount[_Candidate] += 1;
        Users[msg.sender] = true;
    }

    function SearchForCandidate(string memory _Candidate) public view returns(uint256) {
        require(VoteCount[_Candidate] >= 1, "There is no such candidate.");
        return VoteCount[_Candidate];
    }

    function Withdraw(address _Address) public {
        require(msg.sender == Owner, "This function is exclusive to the contract owner only.");
        require(_Address == Owner, "This function is exclusive to the contract owner only.");
        Owner.transfer(address(this).balance);
    }

    function TransferOwner(address _NewOwner) public {
        require(msg.sender == Owner, "This function is exclusive to the contract owner only.");
        Owner = payable(_NewOwner);
    }

    function deposit() public payable {}

}