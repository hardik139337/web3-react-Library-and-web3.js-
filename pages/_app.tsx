import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
