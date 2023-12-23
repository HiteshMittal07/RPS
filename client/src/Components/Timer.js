import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
export default function Timer() {
  const { contractAddress, j2Play, timer, seconds, setSeconds } =
    useContext(CreateGameContext);
  const Timeout = async () => {
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    console.log(signer);
    let contract = new ethers.Contract(contractAddress, contractABI, signer);

    let contractRead = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    if (!j2Play) {
      try {
        const tx = await contract.j2Timeout();
        await tx.wait();
        toast.error("Timeout called by J1");
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        const tx = await contract.j1Timeout();
        await tx.wait();
        toast.error("Timeout called by J2");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (timer && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [seconds, timer]);

  const displayTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Countdown Timer</h5>
        <div className="display-4 text-center mb-4">
          Time Remaining: {displayTime()}
        </div>
        {seconds <= 0 && (
          <button className="btn btn-danger" onClick={Timeout}>
            Timeout
          </button>
        )}
      </div>
    </div>
  );
}
