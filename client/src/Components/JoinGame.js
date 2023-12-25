import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
import "./Game.css";
export default function JoinGame() {
  const {
    J1,
    setJ1,
    SetTimer,
    setContractAddress,
    setSeconds,
    setJ2Play,
    setJ2,
    contractAddress,
    setPlayerTurn,
    connected,
  } = useContext(CreateGameContext);
  const [showModal, setShowModal] = useState(false);
  const JoinGame = async () => {
    if (contractAddress !== null) {
      toast.error("You have already joined the Game");
      return;
    }
    const add1 = document.querySelector("#addr").value;
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    let contractRead = new ethers.Contract(add1, contractABI, provider);
    let contract = new ethers.Contract(add1, contractABI, signer);
    try {
      let tx = await contract.Join();
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
      return;
    }
    setContractAddress(add1);
    setJ2(signer.address);
    SetTimer(true);
    toast.success("You has Joined the Game");
    // try {
    //   const contractRead = new ethers.Contract(add1, contractABI, provider);
    //   const tx1 = await contractRead.getJ1();
    //   setJ1(tx1);
    // } catch (error) {
    //   toast.error(error);
    // }
    contractRead.on("wins", (winner, event) => {
      if (winner == J1) {
        toast.success(`Winner: J1`);
      } else {
        toast.success(`Winner: J2`);
      }
      setSeconds(300);
      SetTimer(false);
      setJ2(null);
      setJ1(null);
      setContractAddress(null);
      event.removeListener();
    });
    contractRead.on("J2Move", (m, event) => {
      if (m == 1) {
        toast.success(`J2 has played Rock`);
      } else if (m == 2) {
        toast.success(`J2 has played Paper`);
      } else if (m == 3) {
        toast.success(`J2 has played Scissor`);
      } else if (m == 4) {
        toast.success(`J2 has played Lizard`);
      } else {
        toast.success(`J2 has played Spock`);
      }
      setSeconds(300);
      setJ2Play(true);
      setPlayerTurn("J1");
      event.removeListener();
    });
    contractRead.on("J1Move", (m, event) => {
      if (m == 1) {
        toast.success(`J1 has played Rock`);
      } else if (m == 2) {
        toast.success(`J1 has played Paper`);
      } else if (m == 3) {
        toast.success(`J1 has played Scissor`);
      } else if (m == 4) {
        toast.success(`J1 has played Lizard`);
      } else {
        toast.success(`J2 has played Spock`);
      }
      event.removeListener();
    });
    contractRead.on("Tie", (status, event) => {
      toast.info("It is a TIE");
      setSeconds(300);
      SetTimer(false);
      setJ1(null);
      setJ2(null);
      setContractAddress(null);
      event.removeListener();
    });
    setPlayerTurn("J2");
    setShowModal(false);
  };

  const openModal = () => {
    if (!connected) {
      toast.error("First connect the wallet");
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <button className="join-game-btn text-light" onClick={openModal}>
        Join Game
      </button>
      {showModal && (
        <>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
            }}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className="modal"
            tabIndex="-1"
            style={{
              display: "block",
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Join the Game</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Input fields for the modal */}
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter the address"
                    id="addr"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={JoinGame}>
                    Join
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
