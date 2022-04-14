import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useMemo, useState } from "react";
import * as providers from "./vallet";

export function Test() {
  const web3React = useWeb3React<Web3Provider>();
  const [balance0, setBalance0] = useState("");

  useMemo(() => {
    web3React.library
      ?.getBalance(web3React.account ?? "")
      .then((value) => {
        setBalance0(value._hex);
      })
      .catch(console.log);
  }, [web3React.account, web3React.chainId]);

  useEffect(() => {
    let provider = localStorage.getItem("provider") as keyof typeof providers;
    if (provider) return;
    web3React.activate(providers[provider]).catch(console.log);
  }, []);

  function activeProvider(providerType: keyof typeof providers) {
    web3React.activate(providers[providerType]).catch(console.warn);
    localStorage.setItem("provider", providerType);
  }

  return (
    <div
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      <div>
        account:
        {web3React.active && web3React.account}
      </div>
      <br />
      <div>account balance :{balance0 ?? ""}</div>
      <br />
      <div>
        chained:
        {web3React.active && web3React.chainId}
      </div>
      <br />

      {Object.keys(providers).map((value) => (
        <button
          key={value}
          onClick={() => activeProvider(value as keyof typeof providers)}
        >
          {value}
        </button>
      ))}
      <button
        onClick={() => {
          web3React.deactivate();
          localStorage.removeItem("provider");
        }}
      >
        disconnect
      </button>
    </div>
  );
}
