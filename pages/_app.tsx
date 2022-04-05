import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider
      getLibrary={(provider) => {
        let provider1 = new ethers.providers.Web3Provider(provider);
        return provider1;
      }}
    >
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
