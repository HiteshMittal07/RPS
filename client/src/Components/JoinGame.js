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
    setPlayerTurn,
    SetTimer,
    setContractAddress,
    setSeconds,
    setJ2Play,
    setJ2,
    contractAddress,
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
    console.log(signer);
    let contract, contractRead;
    let tx;
    let tx1;
    try {
      contract = new ethers.Contract(add1, contractABI, signer);

      contractRead = new ethers.Contract(add1, contractABI, provider);
      tx = await contractRead.getJ2();
      await tx.wait();
      console.log(tx);
    } catch (error) {
      toast.error("Game don't exist");
      return;
    }
    if (signer.address == tx) {
      setContractAddress(add1);
      setJ2(signer.address);
      const tx = await contractRead.getTimer();
      setSeconds(tx);
      SetTimer(true);
      toast.success("J2 has Joined the Game");
    } else {
      toast.error("You can't join the Game");
      return;
    }
    try {
      contract = new ethers.Contract(add1, contractABI, signer);

      contractRead = new ethers.Contract(add1, contractABI, provider);
      tx1 = await contractRead.getJ1();
      // await tx.wait();
      console.log(tx1);
    } catch (error) {
      toast.error(error);
    }
    setJ1(tx1);
    contractRead.on("wins", (winner, event) => {
      if (winner == J1) {
        toast.success(`Winner: J1`);
      } else {
        toast.success(`Winner: J2`);
      }
      setSeconds(300);
      SetTimer(false);
      setJ2(null);
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
      event.removeListener();
    });
    contractRead.on("Tie", (status, event) => {
      toast.info("It is a TIE");
      setSeconds(300);
      event.removeListener();
    });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <button className="join-game-btn" onClick={openModal}>
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
                  <h5 className="modal-title">Create the Game</h5>
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
