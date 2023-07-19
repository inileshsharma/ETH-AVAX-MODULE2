import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [holder, setHolder] = useState(undefined);
  const [pin, setPin] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [age,setAge] = useState(undefined);
  const [ageinp,setAgeInp] = useState(undefined);


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const handlAgeChange = (event) => {
    setAgeInp(event.target.value);
  };


  const enterPin = async () => {
    if(atm){
      const a = parseInt(pin);
      const result = await atm.enterPin(a);
      setMessage(result);
  }
 };

  const checkEligibility = async () => {
    if(atm){
      const num = parseInt(ageinp);
      const getnum = await atm.checkEligibility(num);
      setAge(getnum);
    }
  };

  const accountOwner = async () => {
    if(atm){
      const NAME = await atm.accountOwner();
      setHolder(NAME);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={{backgroundColor:"aliceblue"}}>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        
        <input type="number" placeholder="ENTER YOUR AGE" value={ageinp} onChange={handlAgeChange} />
        <button onClick={checkEligibility}>CHECK ELIGIBILITY</button>
        <p>DEAR USER:{age}</p>

        <input type="number" placeholder="Create PIN" value={pin} onChange={handlePinChange} />
        <button onClick={enterPin}>Save Pin</button>
        <p style={{backgroundColor:"cornsilk"}}>Congrats!!! Your Pin-Password is Saved as: {message ? message.toString():""}</p>
       
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={accountOwner}>GET OWNER NAME</button>
       
        <p style={{backgroundColor:"aliceblue"}}>ACCOUNT HOLDER NAME IS:{holder}</p>
      </div>

    )
  }
  
  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header style={{backgroundColor: "lightblue"}}>
      <h1>Welcome to the Metacrafters ATM!</h1>
      <h2>!!!ETH-AVAX MODULE-2 PROJECT!!!</h2>
      </header>

      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
          
        }
      `}
      </style>
    </main>
  )
}