import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../ABI/RPS.json";
import { CreateGameContext } from "../RPSContext";
import "./Game.css";
export default function CreateGame() {
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
  const CreateGame = async () => {
    if (J1 !== null) {
      toast.error("You are already in game");
      return;
    }
    const commit = document.querySelector("#commitment").value;
    const address1 = document.querySelector("#Opaddress").value;
    const amount = document.querySelector("#amount").value;
    const contractABI = abi.abi;
    const bytecode = abi.bytecode;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    const ContractInstance = new ethers.ContractFactory(
      contractABI,
      bytecode,
      signer
    );
    console.log(ContractInstance);
    let option = { value: ethers.parseEther(amount) };
    let contractInstance;
    try {
      contractInstance = await ContractInstance.deploy(
        commit,
        address1,
        option
      );
      await contractInstance.waitForDeployment();
      console.log("Deployed contract address - ", contractInstance.target);
    } catch (error) {
      toast.error(error.reason);
    }
    SetTimer(true);
    toast.success("J1 Has Played his Move");
    setContractAddress(contractInstance.target);
    let contract = new ethers.Contract(
      contractInstance.target,
      contractABI,
      signer
    );
    let contractRead = new ethers.Contract(
      contractInstance.target,
      contractABI,
      provider
    );
    setJ1(signer.address);
    contractRead.on("wins", (winner, event) => {
      if (winner == J1) {
        toast.success(`Winner: J1`);
      } else {
        toast.success(`Winner: J2`);
      }
      setSeconds(300);
      SetTimer(false);
      setJ1(null);
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
    contractRead.on("Tie", (status) => {
      toast.info("It is a TIE");
      setSeconds(300);
    });
    contractRead.on("joined", (status, event) => {
      toast.success("J2 has Joined the Game");
    });
    setJ2(address1);
    setPlayerTurn("J2");
    setShowModal(false);
    const tx = await contractRead.getTimer();
    console.log(tx);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button className="create-game-btn" onClick={openModal}>
        Create Game
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
                    placeholder="Enter the commitment"
                    id="commitment"
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter the opponent address"
                    id="Opaddress"
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter the amount to stake"
                    id="amount"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={CreateGame}>
                    Start Game
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
