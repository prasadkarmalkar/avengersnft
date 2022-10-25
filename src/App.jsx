import { ethers } from "ethers";
import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import ironman from "./assets/ironman.png";
import captain from "./assets/captain.png";
import thor from "./assets/thor.png";
import doctor from "./assets/doctor.jpg";
import spider from "./assets/spiderman.jpg";
import blackwidow from "./assets/blackwidow.jpg";
import blackpanther from "./assets/blackpanther.jpg";
import AVGABI from "./AvengersNFT.json";
import minting from "./assets/minting.gif";
import error from "./assets/error.gif";
function App() {
  function generateRandom(min = 0, max = 100) {
    // find diff
    let difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
  }

  const avengers = [
    { img: ironman, name: "Iron Man" },
    { img: captain, name: "Captain America" },
    { img: thor, name: "Thor" },
    { img: doctor, name: "Doctor Strange" },
    { img: spider, name: "Spider Man" },
    { img: blackwidow, name: "Black Widow" },
    { img: blackpanther, name: "Black Panther" },
  ];

  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedAvenger, setSelectedAvenger] = useState(null);
  const [mintingState, setMintingState] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [tx, setTx] = useState(null);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then((acc) => {
        setWalletAddress(acc[0]);
      })
      .catch((err) => {
        alert(err.message);
        setWalletAddress(null);
      });

    // console.log(acc);
    // const signer = provider.getSigner();
    // const sign = await signer.signMessage(
    //   "I accept the terms and conditions of AvengersNFT"
    // );
    // console.log(sign);
  };

  const mintNFT = async () => {
    if (!walletAddress) {
      alert("Please Connect Your Wallet");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const avengersNFT = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      AVGABI.abi,
      signer
    );
    setMintingState("started");
    try {
      let random = 0;
      if (selectedAvenger == "Iron Man") {
        random = generateRandom(0, 5);
      } else if (selectedAvenger == "Captain America") {
        random = generateRandom(5, 10);
      } else if (selectedAvenger == "Thor") {
        random = generateRandom(10, 14);
      } else if (selectedAvenger == "Doctor Strange") {
        random = generateRandom(14, 18);
      } else if (selectedAvenger == "Spider Man") {
        random = generateRandom(18, 21);
      } else if (selectedAvenger == "Black Widow") {
        random = generateRandom(21, 24);
      } else if (selectedAvenger == "Black Panther") {
        random = generateRandom(24, 27);
      }else{
        alert('Select Your Favourite Avenger')
        return;
      }
      console.log(random);
      const result = await avengersNFT.safeMint(random);
      setTx(result.hash);
      setMintingState("confirmed");
      avengersNFT.on("getToken", (_from, _value) => {
        setTokenId(parseInt(_value._hex, 16));
      });
      await result.wait();
      setTimeout(() => {
        setMintingState("minted");
      }, 4000);
    } catch (error) {
      setMintingState("error");
    }
  };

  useEffect(() => {
    console.log(mintingState);
  }, [mintingState]);

  return (
    <div className="">
      <header className="flex justify-between px-8 mx-10 rounded-full py-2  items-center bg-slate-700 mt-8">
        <h1 className="font-bold text-lg flex items-center">
          <img src={logo} className="w-14" />
        </h1>
        <div className="text-primary font-bold text-4xl">AvengersNFT</div>
        {walletAddress ? (
          <div
            className="tooltip tooltip-left text-success"
            data-tip={`${walletAddress}`}
          >
            <button className="btn rounded-full btn-outline btn-success">
              {walletAddress.substring(0, 9)}...
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary rounded-full btn-outline"
            onClick={connectWallet}
          >
            Connect to wallet
          </button>
        )}
      </header>

      <div className="mt-10 border rounded-2xl m-10 border-primary">
        <h1 className="text-center text-3xl text-slate-200 font-semibold  py-5">
          Select your favourite avenger
        </h1>
      </div>

      <div className="border rounded-2xl mx-10 mb-10 mt-5  border-primary">
        <div className="mx-10 my-10 flex flex-wrap items-stretch gap-20 justify-evenly">
          {avengers.map((avenger) => {
            return (
              <div
                onClick={() => setSelectedAvenger(avenger.name)}
                className={`${
                  selectedAvenger == avenger.name ? "border-4 " : ""
                }bg-gradient-to-b border-primary from-gray-700 via-gray-900 to-black card card-compact w-60 bg-base-100 shadow-xl hover:bg-gradient-to-t  hover:from-slate-900 hover:via-purple-900 hover:to-slate-900`}
              >
                <figure>
                  <img
                    className="h-96 w-full"
                    src={avenger.img}
                    alt={avenger.name}
                  />
                </figure>
                <div className="card-body flex items-center">
                  <h2 className="flex items-center text-2xl text-center font-semibold text-slate-100">
                    {avenger.name}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mb-10">
          <button
            onClick={mintNFT}
            className="btn btn-wide shadow-2xl btn-primary btn-outline rounded-full"
          >
            Mint Your NFT
          </button>
        </div>
      </div>

      {mintingState && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <label
              onClick={() => setMintingState(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold text-center">
              {mintingState === "started" && "Please Confirm The Transaction"}
              {mintingState === "confirmed" && "Minting the NFT"}
              {mintingState === "minted" && "YAY! NFT minted successfully"}
              {mintingState === "error" && "Something Went Wrong Plz Try Again"}
            </h3>
            {mintingState === "error" ? (
              <img className="my-2" src={error} />
            ) : (
              <img className="my-2" src={minting} />
            )}
            {mintingState === "minted" && (
              <div>
                <div className="flex justify-around mt-4">
                  <a
                    className="btn btn-sm btn-success btn-outline rounded-full"
                    target="_blank"
                    href={`https://testnets.opensea.io/assets/mumbai/${process.env.REACT_APP_CONTRACT_ADDRESS}/${tokenId}`}
                  >
                    Show NFT On OpenSea
                  </a>
                  <a
                    className="btn btn-sm btn-primary btn-outline rounded-full"
                    target="_blank"
                    href={`https://mumbai.polygonscan.com/tx/${tx}`}
                  >
                    Show TX On PolygonScan
                  </a>
                </div>
                <p className="text-center text-warning mt-2">
                  Note: If NFT is not visible on OpenSea Try Visiting after some
                  time or Refresh OpenSea Page
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
