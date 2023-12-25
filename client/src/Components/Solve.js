import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
import { FaCopy } from "react-icons/fa";
export default function Solve() {
  const { contractAddress, J1, playerTurn, seconds } =
    useContext(CreateGameContext);

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
    const salt = document.querySelector("#salt").value;
    try {
      const tx = await contract.solve(selectedValue, salt);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(contractAddress)
      .then(() => {
        toast.success("Text copied to clipboard:", contractAddress);
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  const [selectedValue, setSelectedValue] = useState(1);

  const handleSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log("Selected value:", value);
  };
  return (
    <div
      className="card bg-transparent border-3 border-light text-light"
      style={{
        border: `3px solid ${
          seconds > 0 && playerTurn === "J1" ? "green" : "transparent"
        }`,
      }}
    >
      {contractAddress == null ? (
        ""
      ) : (
        <div>
          <h5 className="contract-address">
            Contract Address: {contractAddress}
          </h5>
          <button
            onClick={handleCopy}
            className="btn btn-light ms-2"
            style={{ fontSize: "10px" }}
          >
            <FaCopy />
          </button>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">J1 Move</h5>
        <div className="row mb-3">
          <div className="col">
            <select className="form-select" onChange={handleSelectionChange}>
              <option value="1">Rock</option>
              <option value="2">Paper</option>
              <option value="3">Scissors</option>
              <option value="4">Spock</option>
              <option value="5">Lizard</option>
            </select>
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
            <button className="btn btn-success" onClick={solve}>
              Solve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
