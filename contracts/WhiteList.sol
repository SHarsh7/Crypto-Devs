//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhiteList{
    //Num of addresses max allowed
    uint8 public maxAddress;

    // map of addresses ehich are whitelisted
    mapping (address=>bool) public whitleListAddresses;

    //to check how many addresses are whitelisted
    uint8 public numOfWhiteListed;

    //This will take max allowed addresses at the deplyment
    constructor(uint8 _maxAddress){
        maxAddress=_maxAddress;
    }

    function addAddressToWhiteList() public {
        require(!whitleListAddresses[msg.sender],"Sender is whitelisted");

        require(numOfWhiteListed<maxAddress,"more addresses cant be added sorry!");

        whitleListAddresses[msg.sender]=true;

        numOfWhiteListed++;


    }

}
