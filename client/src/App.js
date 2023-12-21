import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import "./App.css";
import abi from "./ABI/RPS.json";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [contractAddress, setContractAddress] = useState("");
  const [account, setAccount] = useState("not connected");
  const [timer, SetTimer] = useState(false);
  const [j2Play, setJ2Play] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("J1");
  const [J1, setJ1] = useState("");
  const [J2, setJ2] = useState("");
  const connectWallet = async () => {
    const contractAddress = "0x456F80d466ed0E58803444F50ba5f845AcF274d6";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      setAccount(accounts);
      setConnected(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const CreateGame = async () => {
    // const contractAddress = "0x456F80d466ed0E58803444F50ba5f845AcF274d6";
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
    const contractInstance = await ContractInstance.deploy(
      commit,
      address1,
      option
    );
    await contractInstance.waitForDeployment();
    console.log("Deployed contract address - ", contractInstance.target);
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
    contractRead.on("wins", (winner, event) => {
      if (winner == "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa") {
        toast.success(`Winner: J1`);
      } else {
        toast.success(`Winner: J2`);
      }
      setSeconds(300);
      SetTimer(false);
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
    setJ1(signer.address);
    setJ2(address1);
    setPlayerTurn("J2");
    setShowModal(false);
  };

  const Play = async () => {
    // const { contractAddress } = state;
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    console.log(signer);
    if (signer.address == J1) {
      toast.error("Only J2 can call this");
      return;
    }
    // console.log(contractAddress);
    let contract = new ethers.Contract(contractAddress, contractABI, signer);
    let contractRead = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    // const move = document.querySelector("#selection").value;
    const amount = document.querySelector("#amount2").value;
    const option = { value: ethers.parseEther(amount) };
    // const { contract } = state;
    try {
      const tx = await contract.play(selectedValue, option);
      await tx.wait();
      setPlayerTurn("J1");
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log("Selected value:", value);
    // You can perform further actions or logic with the selected value here
  };

  const solve = async () => {
    // const { contractAddress } = state;
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
      toast.error(error);
    }
  };

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

  const [showModal, setShowModal] = useState(false);

  const openModal = async () => {
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    if (signer.address == "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa") {
      setShowModal(true);
    } else {
      toast.error("Only J1 can create the game");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [seconds, setSeconds] = useState(300);

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
    <div className="App">
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            {/* <img src={logo} alt="Logo" className="logo-img" /> */}
            <h3 className="brand-name">ROCK/PAPER/SCISSOR</h3>
          </a>
          {connected ? (
            <button className="btn btn-light">Connected</button>
          ) : (
            <button className="btn btn-light" onClick={connectWallet}>
              Connect wallet
            </button>
          )}
        </div>
      </nav>
      <div className="container">
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

        <div>
          <button
            className="btn btn-primary mt-3 mb-3"
            style={{ marginLeft: "570px" }}
            onClick={openModal}
          >
            Create Game
          </button>

          {showModal && (
            <div
              className="modal"
              tabIndex="-1"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    {/* Your input fields for the modal */}
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
          )}
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">J2 Move</h5>
            <div className="row mb-3">
              <div className="col">
                <select
                  className="form-select"
                  onChange={handleSelectionChange}
                >
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
                  placeholder="Amount to stake"
                  id="amount2"
                />
              </div>
              <div className="col">
                <button className="btn btn-primary" onClick={Play}>
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">J1 Move</h5>
            <div className="row mb-3">
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
                <button className="btn btn-primary" onClick={solve}>
                  Solve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
