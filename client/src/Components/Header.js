import React, { useContext, useState } from "react";
import { RPSContext } from "../RPSContext";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Header() {
  const { account, setAccount, connected, setConnected } =
    useContext(RPSContext);
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      setAccount(accounts);
      setConnected(true);
    } catch (error) {
      alert.error(error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
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
  );
}
