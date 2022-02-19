import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
import {useState} from "react";
import {ethers} from "ethers"

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const TokenAddress = "0x53871C9a37c079C267A291f05Dc8dcF157A1c4cf"

function App() {
  console.log("Greeter ABI: ", Greeter.abi);
  const [greeting , setGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting(){
    if(typeof Window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(Window.ethereum);
      const contract = new ethers.Contract(greeterAddress , Greeter.abi, provider );
      try{
        const data = await contract.greet();
        console.log("data:", data);

      }
      catch(error){
        console.log("err: ", error)
      }
    }
  }

    async function setGreeting(){
      if(!greeting) return;if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
        const transaction = await contract.setGreeting(greeting)
        await transaction.wait()
        fetchGreeting()
      }

    }

    async function getBalance(){
      if(typeof window.ethereum !== "undefined"){
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.provider.web3Provider(window.ethereum);
        const contract = new ethers.Contract(TokenAddress, Token.abi, provider);
        const balance = await contract.balanceOf(account);
      }
    }

    async function sendCoins(){
      if(typeof window.ethereum !== "undefined"){
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(TokenAddress, Token.abi, signer)
       const transaction = await contract.transfer(userAccount, amount)
       await transaction.wait()
       console.log(`${amount} Coins successfully sent to ${userAccount}`);
      }
    }

  return (
    <div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
    </div>
  );
}

export default App;
