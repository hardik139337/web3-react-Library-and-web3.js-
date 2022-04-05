import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { providers } from "../com/vallet";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

const Home: NextPage = () => {
  const web3React = useWeb3React<Web3Provider>();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    let provider = localStorage.getItem("provider");
    if (!provider) return;
    web3React.activate((providers as any)[provider]);
  }, []);

  useEffect(() => {
    if (!web3React.library) return;
    if (!web3React.account) return;

    web3React.library
      .getBalance(web3React.account)
      .then((balance) => {
        setBalance(balance._hex);
      })
      .catch(console.log);
  }, [web3React.account, web3React.library, web3React.chainId]);

  return (
    <div>
      <div>
        account:
        {web3React.active && web3React.account}
      </div>
      <br />
      <div>account balance :{balance}</div>
      <br />
      <div>
        chainid:
        {web3React.active && web3React.chainId}
      </div>
      <br />
      <button
        onClick={() => {
          web3React.activate(providers.Injected);
          localStorage.setItem("provider", "Injected");
        }}
      >
        Metamask
      </button>
      <button
        onClick={() => {
          web3React.activate(providers.CoinbaseWallet);
          localStorage.setItem("provider", "CoinbaseWallet");
        }}
      >
        Coinbase Wallet
      </button>
      <button
        onClick={() => {
          web3React.activate(providers.WalletConnect);
          localStorage.setItem("provider", "WalletConnect");
        }}
      >
        Wallet Connect
      </button>
      <button
        onClick={(event) => {
          web3React.deactivate();
          localStorage.removeItem("provider");
          setBalance("");
        }}
      >
        disconnect
      </button>
    </div>
  );
};

export default Home;
