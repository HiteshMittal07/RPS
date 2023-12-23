import { useState, createContext } from "react";

import "./App.css";
import CreateGame from "./Components/CreateGame";
import JoinGame from "./Components/JoinGame";
import { RPSContext, CreateGameContext } from "./RPSContext";
import Header from "./Components/Header";
import Solve from "./Components/Solve";
import Play from "./Components/Play";
import Timer from "./Components/Timer";
// const RPSContext = createContext();
function App() {
  const [contractAddress, setContractAddress] = useState(null);
  const [account, setAccount] = useState("not connected");
  const [timer, SetTimer] = useState(false);
  const [j2Play, setJ2Play] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("J1");
  const [J1, setJ1] = useState(null);
  const [J2, setJ2] = useState(null);
  const [seconds, setSeconds] = useState(300);

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
        }}
      >
        <div className="App">
          {J1 == null && J2 == null ? (
            <div className="container">
              <h2 className="text-bold">Let's Begin</h2>
              <div className="button-container">
                <CreateGame />
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
    </RPSContext.Provider>
  );
}

export default App;
