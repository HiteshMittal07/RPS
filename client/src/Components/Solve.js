import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
import { FaCopy } from "react-icons/fa";
export default function Solve() {
  const { contractAddress, J1 } = useContext(CreateGameContext);

  const solve = async () => {
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    if (signer.address !== J1) {
      toast.error("Only J1 can call this");
      return;
    }
    console.log(signer);
    let contract = new ethers.Contract(contractAddress, contractABI, signer);

    let contractRead = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    // const { contract } = state;
    const move = document.querySelector("#move").value;
    const salt = document.querySelector("#salt").value;
    try {
      const tx = await contract.solve(move, salt);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(contractAddress) // Copies text to clipboard
      .then(() => {
        // Handle successful copy
        toast.success("Text copied to clipboard:", contractAddress);
        // You can also provide feedback to the user about successful copy
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error copying text:", error);
        // Provide feedback to the user about the error
      });
  };
  return (
    <div className="card">
      {contractAddress == null ? (
        ""
      ) : (
        <div className="contract-address">
          <h3>Contract Address: {contractAddress}</h3>
          <button onClick={handleCopy} className="copy-button">
            <FaCopy />
          </button>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">J1 Move</h5>
        <div className="row mb-3">
          {/* Input fields and Solve button */}
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter the move"
              id="move"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter the salt"
              id="salt"
            />
          </div>
          <div className="col">
            <button className="btn btn-dark" onClick={solve}>
              Solve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
