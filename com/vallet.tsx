import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

const TESTNET_CHAIN_ID = 80001; //polygon testnet
const MAINNET_CHAIN_ID = 137; //polygon mainenet

const RPC_URLS = {
  MAINNET_CHAIN_ID: "https://polygon-rpc.com/", //polygon mainnet
  TESTNET_CHAIN_ID: "https://rpc-mumbai.maticvigil.com/", //polygon testnet
};

export const CoinbaseWallet = new WalletLinkConnector({
  url: RPC_URLS.TESTNET_CHAIN_ID,
  // appLogoUrl: ''
  appName: "Web3-react Demo",
  supportedChainIds: [TESTNET_CHAIN_ID, MAINNET_CHAIN_ID],
});

export const WalletConnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  supportedChainIds: [TESTNET_CHAIN_ID, MAINNET_CHAIN_ID],
});

export const Metamask = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
