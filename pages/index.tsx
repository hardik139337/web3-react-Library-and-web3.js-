import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";

import * as providers from "../com/vallet";
import { SetStateAction, useState } from "react";

import {
  busdtokenabi,
  busdTokenAddress,
  busttokenabi,
  bustTokenAddress,
  pairabi,
  pairAddress,
  spenderabi,
  spenderAddress,
} from "../com/spenderabi";
import Web3 from "web3";

const deadline = Math.floor(new Date().getTime() / 1000) + 900;


const Home: NextPage = () => {
  const web3React = useWeb3React();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [click, setClick] = useState<"busd" | "bust">();

  const PairContract = web3React.active && new web3React.library?.eth?.Contract(
    // @ts-ignore
    pairabi,
    pairAddress
  );
  const spenderContractInstance =web3React.active && new web3React.library?.eth?.Contract(
    // @ts-ignore
    spenderabi,
    spenderAddress
  );

  const busdTokenContractInstance =web3React.active && new  web3React.library?.eth?.Contract(
    // @ts-ignore
    busdtokenabi,
    busdTokenAddress
  );
  const bustTokenContractInstance =web3React.active && new web3React.library?.eth?.Contract(
    // @ts-ignore
    busttokenabi,
    bustTokenAddress
  );

  const approveSwapBusdLpToken = async () => {
    try {
      const approveBusdToken = await busdTokenContractInstance.methods
        .approve(spenderAddress, web3React.library.utils.toWei(from.toString()))
        .send({
          from: web3React.account,
        });
      return approveBusdToken;
    } catch (error) {
      console.log("approveBusdLpToken is failed", error);
    }
  };

  // const switchEthereumChain = async () => {
  //   try {
  //     await web3React.library?.provider.request?.({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: "0x61" }],
  //     });
  //   } catch (e: any) {
  //     if (e.code === 4902) {
  //       try {
  //         web3React.library?.provider.request?.({
  //           method: "wallet_addEthereumChain",
  //           params: [
  //             {
  //               chainId: "0x61",
  //               chainName: "Smart Chain - Testnet",
  //               nativeCurrency: {
  //                 name: "Binance",
  //                 symbol: "BNB", // 2-6 characters long
  //                 decimals: 18,
  //               },
  //               blockExplorerUrls: ["https://testnet.bscscan.com"],
  //               rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  //             },
  //           ],
  //         });
  //       } catch (addError) {
  //         console.error(addError);
  //       }
  //     }
  //     console.error(e);
  //   }
  // };

  async function handelFromInput(event: { target: { value: any } }) {
    let _tmp_webstorm_ = event.target;
    const { value } = event.target;
    if (value == "") return;

    setFrom(value);
    setClick("busd");

    const temp1 = await spenderContractInstance.methods
      .getAmountsOut(web3React.library.utils.toWei(value.toString()), [
        busdTokenAddress,
        bustTokenAddress,
      ])
      .call()
      .catch(console.log);

    setTo(web3React.library.utils.fromWei(temp1[1].toString()));
    console.log(temp1);
  }

  function getOnChangeTo() {
    return async (event: { target: { value: SetStateAction<string> } }) => {
      if (event.target.value == "") return;
      setTo(event.target.value);
      setClick("bust");

      const temp2 = await spenderContractInstance.methods
        .getAmountsIn(
          web3React.library.utils.toWei(event.target.value.toString()),
          [busdTokenAddress, bustTokenAddress]
        )
        .call()
        .catch(console.log);

      setFrom(web3React.library.utils.fromWei(temp2[0].toString()));
    };
  }

  function getOnClickSubmit() {
    return async (event: { preventDefault: () => void }) => {
      event.preventDefault();

      if (await approveSwapBusdLpToken()) {
        if (click === "busd") {
          const firstInputToken = await spenderContractInstance.methods
            .swapExactTokensForTokens(
              web3React.library.utils.toWei(from.toString()),
              web3React.library.utils.toWei(to.toString()),
              [busdTokenAddress, bustTokenAddress],
              web3React.account,
              deadline
            )
            .send({ from: web3React.account });

          if (firstInputToken) {
            setFrom("");
            setTo("");
          }
        } else {
          const secondInputToken = await spenderContractInstance.methods
            .swapTokensForExactTokens(
              web3React.library.utils.toWei(to.toString()),
              web3React.library.utils.toWei(from.toString()),
              [busdTokenAddress, bustTokenAddress],
              web3React.account,
              deadline
            )
            .send({ from: web3React.account });

          if (secondInputToken) {
            setFrom("");
            setTo("");
          }
        }
      }
    };
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <div>
            account:
            {web3React.active && web3React.account}
          </div>
          <div>
            chained:
            {web3React.active && web3React.chainId}
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              web3React.activate(providers.Metamask).catch(console.log);
            }}
          >
            connect
          </button>
          <button onClick={web3React.deactivate}>disconnnect</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        from busd
        <input type="text" onChange={handelFromInput} value={from} />
        to bust
        <input type="text" onChange={getOnChangeTo()} value={to} />
        <br />
        <button onClick={getOnClickSubmit()}>convert</button>
      </div>
    </div>
  );
};

export default Home;
