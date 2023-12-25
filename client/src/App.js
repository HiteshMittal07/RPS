import { useState, createContext } from "react";

import "./App.css";
import CreateGame from "./Components/CreateGame";
import JoinGame from "./Components/JoinGame";
import { RPSContext, CreateGameContext } from "./RPSContext";
import Header from "./Components/Header";
import Solve from "./Components/Solve";
import Play from "./Components/Play";
import Timer from "./Components/Timer";
function App() {
  const [contractAddress, setContractAddress] = useState(null);
  const [account, setAccount] = useState("not connected");
  const [timer, SetTimer] = useState(false);
  const [j2Play, setJ2Play] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("J2");
  const [J1, setJ1] = useState(null);
  const [J2, setJ2] = useState(null);
  const [seconds, setSeconds] = useState(300);
  const [J1Move, setJ1Move] = useState(null);

  return (
    <RPSContext.Provider
      value={{
        connected,
        setConnected,
        account,
        setAccount,
      }}
    >
      <Header />
      <div style={{ textAlign: "center" }} className="mt-5">
        <h1 className="text-light fw-bold" style={{ fontSize: "60px" }}>
          ROCK PAPER SCISSORS
        </h1>
        <h2 className="text-light fw-bold" style={{ fontSize: "40px" }}>
          Online
        </h2>
        <CreateGameContext.Provider
          value={{
            J1,
            timer,
            playerTurn,
            seconds,
            setJ1,
            setPlayerTurn,
            SetTimer,
            setContractAddress,
            setSeconds,
            setJ2Play,
            setJ2,
            contractAddress,
            J1Move,
            setJ1Move,
            connected,
          }}
        >
          <div className="App">
            {J1 == null && J2 == null ? (
              <div className="container">
                <div className="row justify-content-center mb-4">
                  <div className="col-4 text-light">
                    <h2>
                      Do you have a dispute <br />
                      with your friend?
                    </h2>
                    <p>Resolve it online!!</p>
                  </div>
                  <div className="col-4 text-light mt-5">
                    <h2>
                      Press "Create Game" to <br /> host a game.
                    </h2>
                    <p>Send him a address to join the game</p>
                  </div>
                </div>
                <h2 className="text-bold text-light">Let's Begin</h2>
                <div className="button-container">
                  <CreateGame />
                  <h5 className="text-light">... or join a game </h5>
                  <JoinGame />
                </div>
              </div>
            ) : J1 == null ? (
              <div>
                <Timer />
                <Play />
              </div>
            ) : (
              <div>
                <Timer />
                <Solve />
              </div>
            )}
          </div>
        </CreateGameContext.Provider>
      </div>
    </RPSContext.Provider>
  );
}

export default App;
