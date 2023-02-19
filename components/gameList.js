import React, { useEffect, useState } from "react";
import sudokuImage from "../assets/NFT.png";
import contractAddress from "../utils/contractaddress.json";
import sudokuContractAbi from "../utils/abiFiles/astroft/AstroFT.json";
import styles from "../styles/Sudoku.module.css";

import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useContractEvent,
  useNetwork,
} from "wagmi";

import { switchNetwork } from "../utils/switchNetwork";

import networks from "../utils/networks.json";
import Image from "next/image";


export default function GameList() {

  const [loadingVerifyBtn, setLoadingVerifyBtn] = useState(false);
  const [loadingVerifyAndMintBtn, setLoadingVerifyAndMintBtn] = useState(false);
  
  const [connectQuery, connect] = useConnect();
  const [accountQuery, disconnect] = useAccount();
  const [{ data, error, loading }] = useNetwork();

  const [signer] = useSigner();

  const provider = useProvider();

  const contract = useContract({
    addressOrName: contractAddress.astroFT,
    contractInterface: sudokuContractAbi.abi,
    signerOrProvider: signer.data || provider,
  });

  const contractNoSigner = useContract({
    addressOrName: contractAddress.astroFT,
    contractInterface: sudokuContractAbi.abi,
    signerOrProvider: provider,
  });



  const calculateProofAndMintNft = async () => {
    setLoadingVerifyAndMintBtn(true);
    console.log("Minting NFT");
    try {
      console.log(accountQuery.data?.address);
      let txn = await contract.safeMint(
        accountQuery.data.address
      );
      await txn.wait();
      setLoadingVerifyAndMintBtn(false);
      alert(
        `Successfully verified! The NFT has been minted and sent to your wallet. You can see the contract here: ${
          networks[networks.selectedChain].blockExplorerUrls[0]
        }address/${contractAddress.astroFT}`
      );
    } catch (error) {
      setLoadingVerifyAndMintBtn(false);
      alert("Wrong solution");
    }
  };

  const verifySudokuAndMintNft = async () => {
    console.log("Address", accountQuery.data?.address);
    calculateProofAndMintNft();
  };

  const renderVerifySudokuAndMintNft = () => {
    if (!accountQuery.data?.address) {
      return (
        <button
          className="text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r from-white to-white hover:from-blue-100 hover:to-blue-200  text-blue-700"
          onClick={() => {
            connect(connectQuery.data.connectors[0]);
          }}
        >
          Connect Wallet to  Mint NFT
        </button>
      );
    } else if (
      accountQuery.data?.address &&
      data.chain.id.toString() !== networks.selectedChain
    ) {
      return (
        <button
          className="text-lg font-medium rounded-md px-5 py-3 bg-gradient-to-r from-white to-white hover:from-blue-100 hover:to-blue-200  text-blue-700"
          onClick={() => {
            switchNetwork();
          }}
        >
          Switch Network to  Mint NFT
        </button>
      );
    } else {
      return (
        <button
          className="flex justify-center items-center disabled:cursor-not-allowed space-x-3 verify-btn text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r bg-gradient-to-r from-yellow-500 to-yellow-500 hover:from-blue-100 hover:to-blue-200  text-blue-700 "
          onClick={verifySudokuAndMintNft}
          disabled={loadingVerifyAndMintBtn}
        >
          {loadingVerifyAndMintBtn && <div className={styles.loader}></div>}
          <span> Mint NFT</span>
        </button>
      );
    }
  };

  const [gameList, setGameList] = useState([
    {
      nameGame: "NFT",
      imageGame: sudokuImage,
      urlGame: renderVerifySudokuAndMintNft,
    },
   
  ]);



  return (
    <div className="flex flex-wrap justify-center items-center place-items-center gap-10">
      {/* {gameList.map((game, index) => {
        return (
          <GameCard
            nameGame={game.nameGame}
            imageGame={game.imageGame}
            urlGame={game.urlGame}
            key={index}
          />
        );
      })} */}

<div className="p-5 border border-slate-600 rounded-md shadow-md shadow-slate-800/50">
      <div className="grid grid-cols-1 place-items-center gap-5">
       
          <a>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white">
             
            </div>
          </a>
       

       
          <a>
            <Image
              src={sudokuImage}
              priority={true}
              width={300}
              height={300}
              alt="nft"
            />
          </a>
       
          
            <div className="flex justify-center items-center my-10">
            {renderVerifySudokuAndMintNft()}
            </div>
      </div>
    </div>

      

    </div>
  );
}
