import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useRef, useEffect, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  //users wallet connected?
  const [walletConnected, setWalletConnected] = useState(false);
  //current address joined whitelist?
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  //loading till transection mined
  const [loading, setLoading] = useState(false);
  //num of addresses whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(1);

  //connect to metamask persist untill the page open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Change to Rinkby");
      throw new Error("change to rinkby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhiteList = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
        console.log(whitelistContract.address);
      const tx = await whitelistContract.addAddressToWhiteList();
      setLoading(true);

      await tx.wait();
      setLoading(false);

      await getNumberOfWhiteListed();
      setJoinedWhitelist(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getNumberOfWhiteListed = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numOfWhitelisted = await whitelistContract.numOfWhiteListed();
      console.log(whitelistContract.whitleListAddresses);

      setNumberOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract. whitleListAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhiteListed();
    } catch (err) {
      console.log(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div className={styles.description}>Thanks for Joining!</div>;
      } else if (loading) {
        return <button className={styles.button}> Loading ...</button>;
      } else {
        return (
          <button onClick={addAddressToWhiteList} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(()=>{
      if(!walletConnected){
            web3ModalRef.current = new Web3Modal({
                network : "rinkeby",
                providerOption: {},
                disableInjectedProvider: false,
            });
            connectWallet();
      }  
    },[walletConnected]);

    return (
        <div>
          <Head>
            <title>Whitelist Dapp</title>
            <meta name="description" content="Whitelist-Dapp" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.main}>
            <div>
              <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
              <div className={styles.description}>
                Its an NFT collection for developers in Crypto.
              </div>
              <div className={styles.description}>
                {numberOfWhitelisted} have already joined the Whitelist
              </div>
              {renderButton()}
            </div>
            <div>
              <img className={styles.image} src="./crypto-devs.svg" />
            </div>
          </div>
    
          <footer className={styles.footer}>
            Made with &#10084; by Harsh
          </footer>
        </div>
      );
    


}
