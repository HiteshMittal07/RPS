import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
export default function Play() {
  const { contractAddress, J1, setPlayerTurn, seconds, playerTurn } =
    useContext(CreateGameContext);
  const Play = async () => {
    // const { contractAddress } = state;
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    console.log(signer);
    // console.log(contractAddress);
    let contract = new ethers.Contract(contractAddress, contractABI, signer);
    let contractRead = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const amount = document.querySelector("#amount2").value;
    const option = { value: ethers.parseEther(amount) };
    try {
      const tx = await contract.play(selectedValue, option);
      await tx.wait();
      setPlayerTurn("J1");
    } catch (error) {
      toast.error(error.reason);
    }
  };

  const [selectedValue, setSelectedValue] = useState(1);

  const handleSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log("Selected value:", value);
  };
  return (
    <div
      className="card mb-3 bg-transparent border-3 border-light text-light"
      style={{
        border: `3px solid ${
          seconds > 0 && playerTurn === "J2" ? "green" : "transparent"
        }`,
      }}
    >
      <div className="card-body">
        <h5 className="card-title">J2 Move</h5>
        <div className="row mb-3">
          {/* Select field, input, and button */}
          <div className="col">
            <select className="form-select" onChange={handleSelectionChange}>
              {/* Options */}
              <option value="1">Rock</option>
              <option value="2">Paper</option>
              <option value="3">Scissors</option>
              <option value="4">Spock</option>
              <option value="5">Lizard</option>
            </select>
          </div>
          {/* Input field */}
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Amount to stake"
              id="amount2"
            />
          </div>
          {/* Play button */}
          <div className="col">
            <button className="btn btn-dark" onClick={Play}>
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
