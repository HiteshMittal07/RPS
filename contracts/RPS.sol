// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract RPS{
    address public j1; // The first player creating the contract.
    address public j2; // The second player.
    enum Move {Null, Rock, Paper, Scissors, Spock, Lizard} // Possible moves. Note that if the parity of the moves is the same the lower one wins, otherwise the higher one. 
    bytes32 public c1Hash; // Commitment of j1.
    Move public c2; // Move of j2. Move.Null before he played.
    uint256 public stake; // Amout bet by each party.
    uint256 public TIMEOUT = 5 minutes; // If some party takes more than TIMEOUT to respond, the other can call TIMEOUT to win.
    uint256 public lastAction; // The time of the last action. Usefull to determine if someone has timed out.
    event Game(bool status);
    event wins(address winner);
    event J2Move(Move m);

    constructor(bytes32 _c1Hash, address _j2)payable{
        stake = msg.value; // La mise correspond à la quantité d'ethers envoyés.
        j1=msg.sender;
        j2=_j2;
        c1Hash=_c1Hash;
        lastAction=block.timestamp;
        emit Game(true);
    }
    function play(Move _c2) public payable {
        require(c2==Move.Null,"J2 has already played"); // J2 has not played yet.
        require(_c2!=Move.Null,"Select one move"); // A move is selected.
        require(msg.value==stake,"Give the stake"); // J2 has paid the stake.
        require(msg.sender==j2,"Only J2 can call this"); // Only j2 can call this function.
            
        c2=_c2;
        lastAction=block.timestamp;
        emit J2Move(_c2);
    }
    
    function solve(Move _c1, uint256 _salt) public {
        require(_c1!=Move.Null,"J1 should play his move"); // J1 should have made a valid move.
        require(c2!=Move.Null,"J2 should play his move"); // J2 must have played.
        
        require(msg.sender==j1,"only J1 can call this"); // J1 can call this.
        require(keccak256(abi.encodePacked(_c1,_salt))==c1Hash,"hash doesn't match"); // Verify the value is the commited one.
        
        if (win(_c1,c2)){
            (bool success,)=payable(j1).call{value: 2*stake}("");
            require(success,"transaction failed");
            emit wins(j1);
        }
        else if (win(c2,_c1)){
            (bool success,)=payable(j2).call{value: 2*stake}("");
            require(success,"transaction failed");
            emit wins(j2);
        }
        else {
            (bool success,)=payable(j1).call{value: stake}("");
            require(success,"transaction failed");
            (bool success2,)=payable(j2).call{value: stake}("");
            require(success2,"transaction failed");
        }
        stake=0;
        c2=Move.Null;
    }
    
    function j1Timeout() public {
        require(c2!=Move.Null,"J2 has not played"); // J2 already played.
        require(block.timestamp > lastAction + TIMEOUT); // Timeout time has passed.
        payable(j2).call{value:2*stake};
        stake=0;
    }

    function j2Timeout() public {
        require(c2==Move.Null); // J2 has not played.
        require(block.timestamp > lastAction + TIMEOUT); // Timeout time has passed.
        payable(j1).call{value: stake};
        stake=0;
    }

    function win(Move _c1, Move _c2) internal pure returns (bool w) {
        if (_c1 == _c2)
            return false; // They played the same so no winner.
        else if (_c1==Move.Null)
            return false; // They did not play.
        else if (uint(_c1)%2==uint(_c2)%2) 
            return (_c1<_c2);
        else
            return (_c1>_c2);
    }
    
}
