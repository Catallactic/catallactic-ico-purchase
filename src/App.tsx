import React from 'react';
import { useState, useEffect} from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import Toast from 'react-bootstrap/Toast';
import { ToastContainer, toast } from 'react-toastify';
import Collapse from 'react-bootstrap/Collapse';
import { utils } from 'ethers';

import emailjs from 'emailjs-com';

import {Contract, ethers} from "ethers"
import {parseEther } from 'ethers/lib/utils'

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Spinner } from 'react-bootstrap';

declare let window:any

function App(this: any) {

	// config
	const MESSAGE_DEFAULT = "Not enough balance to make this purchase.";
	const MESSAGE_NOT_ENOUGHT_BALANCE = "Not enough balance to make this purchase.";

	// ***********************************************************************************************
	// ****************************************** Config *********************************************
	// ***********************************************************************************************
	const CFG_ICO_ABI = require('./GasClickICO.json');
	const CFG_ERC_20_ABI = require('./ERC-20.json');
	const CFG_TOKEN_SYMBOL = 'CYGAS';
	const CFG_TOKEN_DECIMALS = 18;
	const CFG_TOKEN_IMAGE = 'https://static.thenounproject.com/png/2031367-200.png';

	const WBTC_AMOUNTS = function() { return [0.004, 0.02, 0.04, 0.2, 0.4] }
	const ETH_AMOUNTS = function() { return [0.06, 0.3, 0.6, 3, 6] }
	const BNB_AMOUNTS = function() { return [0.33, 1.7, 3.3, 17, 33] }
	const MATIC_AMOUNTS = function() { return [84, 420, 840, 4200, 8400] }
	const USDT_AMOUNTS = function() { return [100, 500, 1000, 5000, 10000] }

	const CYGAS_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 70.21 122.88">
				<path fill="#FFFFFF" d="M19.62,25.08h8.48V8.3H16.41v17.04C17.45,25.17,18.53,25.08,19.62,25.08L19.62,25.08z M42,25.08h8.59 c1.05,0,2.09,0.08,3.1,0.25V8.3H42V25.08L42,25.08z M57.08,26.19c7.63,2.69,13.13,9.99,13.13,18.51v2.88H0v-2.88 c0-8.48,5.45-15.74,13.02-18.47V8.3h-0.29c-2.28,0-4.15-1.87-4.15-4.15v0C8.58,1.87,10.44,0,12.73,0h44.65 c2.28,0,4.15,1.87,4.15,4.15v0c0,2.28-1.87,4.15-4.15,4.15h-0.29V26.19L57.08,26.19z M70.21,52.12v33.4H0v-33.4H70.21L70.21,52.12z M70.21,90.06v10.65c0,5-2.76,9.38-6.84,11.69v6.86c0,1.99-1.63,3.62-3.62,3.62H10.45c-1.99,0-3.62-1.63-3.62-3.62v-6.86 C2.76,110.09,0,105.71,0,100.71V90.06H70.21L70.21,90.06z"/>
			</svg>
		);
	}
	const BTC_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 120 120">
				<g>
					<g>
						<g>
							<g>
								<path fill="#FFFFFF" d="M89.09,22.93l-3,3a42.47,42.47,0,0,1,0,57.32l3,3a46.76,46.76,0,0,0,0-63.39Z"/>
								<path fill="#FFFFFF" d="M26,23.19a42.47,42.47,0,0,1,57.32,0l3-3a46.76,46.76,0,0,0-63.39,0Z"/>
								<path fill="#FFFFFF" d="M23.19,83.28a42.47,42.47,0,0,1,0-57.29l-3-3a46.76,46.76,0,0,0,0,63.39Z"/>
								<path fill="#FFFFFF" d="M83.28,86.05a42.47,42.47,0,0,1-57.32,0l-3,3a46.76,46.76,0,0,0,63.39,0Z"/>
								<path fill="#FFFFFF" d="M73.57,44.62c-.6-6.26-6-8.36-12.83-9V27H55.46v8.46c-1.39,0-2.81,0-4.22,0V27H46v8.68H35.29v5.65s3.9-.07,3.84,0a2.73,2.73,0,0,1,3,2.32V67.41a1.85,1.85,0,0,1-.64,1.29,1.83,1.83,0,0,1-1.36.46c.07.06-3.84,0-3.84,0l-1,6.31H45.9v8.82h5.28V75.6H55.4v8.65h5.29V75.53c8.92-.54,15.14-2.74,15.92-11.09.63-6.72-2.53-9.72-7.58-10.93C72.1,52,74,49.2,73.57,44.62ZM66.17,63.4c0,6.56-11.24,5.81-14.82,5.81V57.57C54.93,57.58,66.17,56.55,66.17,63.4ZM63.72,47c0,6-9.38,5.27-12.36,5.27V41.69C54.34,41.69,63.72,40.75,63.72,47Z"/>
								<path fill="#FFFFFF" d="M54.62,109.26a54.63,54.63,0,1,1,54.64-54.64A54.63,54.63,0,0,1,54.62,109.26Zm0-105A50.34,50.34,0,1,0,105,54.62,50.34,50.34,0,0,0,54.62,4.26Z"/>
							</g>
						</g>
					</g>
				</g>
			</svg>
		);
	}
	const USDT_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 339.43 295.27">
				<path fill="#FFFFFF7F" d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z"/>
				<path fill="#FFFFFF" d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z"/>
			</svg>
		);
	}
	const ETH_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 784.37 1277.39">
				<g>
					<polygon fill="#343434" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
					<polygon fill="#8C8C8C" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
					<polygon fill="#3C3C3B" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
					<polygon fill="#8C8C8C" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
					<polygon fill="#141414" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
					<polygon fill="#393939" points="0,650.54 392.07,882.29 392.07,472.33 "/>
				</g>
			</svg>
		);
	}
	const BNB_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 511.97 511.97">
				<path fill="#FFFFFF" d="M156.56,215.14,256,115.71l99.47,99.47,57.86-57.85L256,0,98.71,157.28l57.85,57.85M0,256l57.86-57.87L115.71,256,57.85,313.83Zm156.56,40.85L256,396.27l99.47-99.47,57.89,57.82,0,0L256,512,98.71,354.7l-.08-.09,57.93-57.77M396.27,256l57.85-57.85L512,256l-57.85,57.85Z"/>
				<path fill="#FFFFFF" d="M314.66,256h0L256,197.25,212.6,240.63h0l-5,5L197.33,255.9l-.08.08.08.08L256,314.72l58.7-58.7,0,0-.05,0"/>
			</svg>
		);
	}
	const MATIC_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 38.4 33.5">
				<g>
					<path fill="#FFFFFF" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
						c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
						c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
						c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
						L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
						c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
				</g>
			</svg>
		);
	}
	const COPY_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="0.8em" height="0.8em" viewBox="0 0 460 460" >
				<g>
					<g>
						<g>
							<path fill="#FFFFFF" d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134h30V32.864c0-1.579,1.285-2.864,2.864-2.864h254.272
								c1.579,0,2.864,1.285,2.864,2.864v254.272c0,1.58-1.285,2.865-2.864,2.865h-74.729v30h74.729
								c18.121,0,32.864-14.743,32.864-32.865V32.864C458.797,14.743,444.055,0,425.934,0z"/>
							<path fill="#FFFFFF" d="M288.339,139.998H34.068c-18.122,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272
								c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z M288.341,430H34.068
								c-1.58,0-2.865-1.285-2.865-2.864V172.863c0-1.58,1.285-2.865,2.865-2.865h254.272c1.58,0,2.865,1.285,2.865,2.865v254.273h0.001
								C291.206,428.715,289.92,430,288.341,430z"/>
						</g>
					</g>
				</g>
			</svg>
		);
	}

	const CROSS_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"	width="0.8em" height="0.8em" viewBox="0 0 503.021 503.021">
				<g>
					<g>
						<path fill="#FFFFFF" d="M491.613,75.643l-64.235-64.235c-15.202-15.202-39.854-15.202-55.056,0L251.507,132.222L130.686,11.407
							c-15.202-15.202-39.853-15.202-55.055,0L11.401,75.643c-15.202,15.202-15.202,39.854,0,55.056l120.821,120.815L11.401,372.328
							c-15.202,15.202-15.202,39.854,0,55.056l64.235,64.229c15.202,15.202,39.854,15.202,55.056,0l120.815-120.814l120.822,120.814
							c15.202,15.202,39.854,15.202,55.056,0l64.235-64.229c15.202-15.202,15.202-39.854,0-55.056L370.793,251.514l120.82-120.815
							C506.815,115.49,506.815,90.845,491.613,75.643z"/>
					</g>
				</g>
			</svg>
		);
	}
	const EYE_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="0.8em" height="0.8em" viewBox="0 0 442.04 442.04" >
				<g>
					<g>
						<path fill="#FFFFFF" d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203
							c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219
							c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367
							c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021
							c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212
							c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071
							c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z"/>
					</g>
					<g>
						<path fill="#FFFFFF" d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188
							c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993
							c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5
							s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z"/>
					</g>
					<g>
						<path fill="#FFFFFF" d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z"/>
					</g>
				</g>
			</svg>
		);
	}
	const DOWN_ARROW = function() {
		return (
			<svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="0.4em" height="0.4em" viewBox="0 0 1024 1024">
				<path fill="#FFFFFF" d="M61.967842 289.470811 955.525977 289.470811 508.786307 736.181829 61.967842 289.470811zM61.967842 289.470811"  />
			</svg>
		);
	}

	const networkMap = {
		POLYGON_MAINNET: {
			chainId: utils.hexValue(137), // '0x89'
			chainName: "Matic(Polygon) Mainnet", 
			nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
			rpcUrls: ["https://polygon-rpc.com"],
			blockExplorerUrls: ["https://www.polygonscan.com/"],
		},
		MUMBAI_TESTNET: {
			chainId: utils.hexValue(80001), // '0x13881'
			chainName: "Matic(Polygon) Mumbai Testnet",
			nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
			rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
			blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
		},
	};

	// ***********************************************************************************************
	// ****************************************** Metamask *******************************************
	// ***********************************************************************************************
	const [METAMASK_INSTALLED, setMetamaskInstalled] = useState<boolean | undefined>()

  // openMetamaskInstall
  const openMetamaskInstall = () => {
		
		let userAgent = navigator.userAgent;
		if(userAgent.match(/chrome|chromium|crios/i)){
			window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank', 'noopener,noreferrer');
		}
		
		if(userAgent.match(/firefox|fxios/i)){
			window.open('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/', '_blank', 'noopener,noreferrer');
		} 

		console.log('Unsupported platform')
	}

	useEffect(() => {
		console.log("useEffect1");
		console.log("MetaMask installed " + window.ethereum !== undefined);
		setMetamaskInstalled(window.ethereum !== undefined);
	}, []);

	useEffect(() => {
		console.log("useEffect2");
		console.log("************************************************************")
		console.log('METAMASK_INSTALLED', METAMASK_INSTALLED);
		if(!METAMASK_INSTALLED) {
			console.log("please install MetaMask")
			return
		}

		// get network
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getNetwork().then((result)=>{
			console.log("setChain")
			setChainId(result.chainId)
		}).catch((e)=>console.log(e))

		window.ethereum.on('chainChanged', (chainId: any) => {
			// Handle the new chain.
			// Correctly handling chain changes can be complicated.
			// We recommend reloading the page unless you have good reason not to.
			window.location.reload();
		});

	},[METAMASK_INSTALLED])

	// ***********************************************************************************************
	// ************************************** Metamask Network ***************************************
	// ***********************************************************************************************
  const [METAMASK_CHAIN_ID, setChainId] = useState<number | undefined>()

	useEffect(() => {
		console.log("useEffect3");
		console.log('METAMASK_CHAIN_ID', METAMASK_CHAIN_ID);
		if(!METAMASK_INSTALLED) {
			console.log("please install MetaMask")
			return
		}

		const provider = new ethers.providers.Web3Provider(window.ethereum)		
		const signer = provider.getSigner();
		const METAMASK_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_METAMASK_CHAINS ? process.env.NEXT_PUBLIC_METAMASK_CHAINS : '[]' )
		const ico_address: string = METAMASK_CHAINS!.find(function (el:any) { return parseInt(el.id) === METAMASK_CHAIN_ID; })?.ico_address || '';
		const ico: Contract = new ethers.Contract(ico_address, CFG_ICO_ABI, signer);
		setICOContract(ico);

	}, [METAMASK_CHAIN_ID]);

	// ***********************************************************************************************
	// ******************************************* ICO Contract **************************************
	// ***********************************************************************************************
	// amount to purchase
	const [ICO_CONTRACT, setICOContract] = useState<Contract>()
	const [CFG_ICO_uUSDT_PRICE, setICOuUSDTPrice]=useState<number>(20000)
	const [ICO_PAYMENT_SYMBOLS, setPaymentSymbols] = useState<any | undefined>();
	const [ICO_STATE, setICOState] = useState<number>(0)
	const [ICO_TOTAL_USD_INVESTED, setICOTotalUSDInvested] = useState<number>(0)
	const [ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	const PAYMENT_CURRENCIES  = [
		{ symbol: "WBTC", icon: BTC_ICON(), amounts: WBTC_AMOUNTS() },
		{ symbol: "WETH", icon: ETH_ICON(), amounts: ETH_AMOUNTS() },
		{ symbol: "ETH", icon: ETH_ICON(), amounts: ETH_AMOUNTS() },
		{ symbol: "BNB", icon: BNB_ICON(), amounts: BNB_AMOUNTS() },
		{ symbol: "MATIC", icon: MATIC_ICON(), amounts: MATIC_AMOUNTS() },
		{ symbol: "USDT", icon: USDT_ICON(), amounts: USDT_AMOUNTS() }
	];
  const getSymbol = (symbol: string) => {
		if(symbol != 'COIN') return symbol;
		else if(METAMASK_CHAIN_ID == 0x7A69) return 'ETH';
		else if(METAMASK_CHAIN_ID == 0xAA36A7) return 'ETH';
		else if(METAMASK_CHAIN_ID == 0x13881) return 'MATIC';
		else if(METAMASK_CHAIN_ID == 0x89) return 'MATIC';
		return 'ETH';
	}

	// load ICO info
	useEffect(() => {
		console.log("************ ICO Contract *****************");
		if(!ICO_CONTRACT?.address) return;
		console.log("useEffect4 ", ICO_CONTRACT?.address);

		ICO_CONTRACT.getPriceuUSD()
			.then((icoUSDPrice: number)=>{
				console.log("USDTprice " + icoUSDPrice);
				setICOuUSDTPrice(icoUSDPrice);
			})

		ICO_CONTRACT.getCrowdsaleStage()
			.then((icoState: number)=>{
				console.log("icoState " + icoState);
				setICOState(icoState);
			})

		ICO_CONTRACT.getTotaluUSDInvested()
			.then((uUSDInvested: number)=>{
				console.log("uUSDInvested " + uUSDInvested);
				setICOTotalUSDInvested(uUSDInvested / 10**6);
			})

		ICO_CONTRACT.getSoftCap()
			.then((ICOSoftCap: number)=>{
				console.log("ICOSoftCap " + ICOSoftCap);
				setICOSoftCap(ICOSoftCap);
			})

		ICO_CONTRACT?.getPaymentSymbols()
			.then((paymentSymbols: boolean)=>{
				console.log("paymentSymbols " + paymentSymbols);
				setPaymentSymbols(paymentSymbols);
			})

	}, [ICO_CONTRACT]);


	const switchToNetwork = async () => {
		console.log("switchToNetwork");

		const tx = await window.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [networkMap.MUMBAI_TESTNET],
		});
		if (tx) {
			console.log(tx)
		}
	}

	// ***********************************************************************************************
	// ************************************* Metamask Account ****************************************
	// ***********************************************************************************************
	const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string>('')

  // click connect
  const onClickConnect = async () => {
		console.log("onClickConnect")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.send("eth_requestAccounts", [])
			.then((accounts)=>{
				
				if(accounts.length > 0) {
					console.log("setting account " + accounts[0])
					setCurrentAccount(accounts[0]);
				}
				console.log("METAMASK_CURRENT_ACCOUNT " + METAMASK_CURRENT_ACCOUNT);

			}).catch((e)=>console.log(e))

  }

  // click disconnect
  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setCurrentAccount('')
	}

	// ***********************************************************************************************
	// ******************************************** Account Status ***********************************
	// ***********************************************************************************************
	const [METAMASK_CURRENT_ACCOUNT_CYGAS_BALANCE_IN_TOKEN, setCygasBalanceInToken] = useState<number | undefined>(0)
	const [METAMASK_CURRENT_ACCOUNT_CYGAS_BALANCE_IN_ICO, setCygasBalanceInICO] = useState<number | undefined>(0)

  useEffect(() => {
		console.log("************ Account Status *****************");
		if(!METAMASK_CURRENT_ACCOUNT || !ethers.utils.isAddress(METAMASK_CURRENT_ACCOUNT)) return;
		console.log("useEffect5");

		ICO_CONTRACT?.getuUSDToClaim(METAMASK_CURRENT_ACCOUNT)
			.then((uUSDToClaim: number)=>{
				console.log("uUSDToClaim " + uUSDToClaim);

				setCygasBalanceInICO(uUSDToClaim / CFG_ICO_uUSDT_PRICE);
				setICOToRefund(uUSDToClaim > 0);
			})

		ICO_CONTRACT?.getTokenAddress()
			.then((tokenAddress: string)=>{
				console.log(`tokenAddress: ${tokenAddress}`);

				if(tokenAddress == '0x0000000000000000000000000000000000000000')
					return;

				// calculate token contract
				const provider = new ethers.providers.Web3Provider(window.ethereum)		
				const signer = provider.getSigner();
				const token: Contract = new ethers.Contract(tokenAddress, CFG_ERC_20_ABI, signer);
				setTokenContract(token);
			})

		window.ethereum.on('accountsChanged', (accounts: any) => {
			// Handle the new accounts, or lack thereof.
			// "accounts" will always be an array, but it can be empty.
			window.location.reload();
		});
		
		//setMaxPurchaseNotKYC(20000);
		// default ICO configuration
		switchPayment('USDT');
		setAmountRawToPay(100);

	},[METAMASK_CURRENT_ACCOUNT])

	// ***********************************************************************************************
	// ****************************************** Payment Method *************************************
	// ***********************************************************************************************
	const [SELECTED_PAYMENT_CURRENCY, setSelectedPaymentCurrency] = useState<string>('USDT');
	const [SELECTED_PAYMENT_ICON, setSelectedPaymentIcon] = useState<JSX.Element | undefined>(USDT_ICON());
	const [SELECTED_PAYMENT_USD_PRICE, setSelectedPaymentUSDPrice] = useState<number>(1);
	const [SELECTED_PAYMENT_BALANCE, setSelectedPaymentBalance] = useState<string>('0');
	const [SELECTED_PAYMENT_ALLOWANCE, setSelectedPaymentAllowance] = useState<number>(0);
	const [SELECTED_PAYMENT_DECIMALS, setSelectedPaymentDecimals] = useState<number>(0);
	const [DYNAMIC_PRICE, setDynamicPrice] = useState<boolean>()

	async function switchPayment(newCurrency: any) {
		console.log("switched to Payment with: " + newCurrency);
		//setSelectedPaymentCurrency(newCurrency);

		// update SELECTED_PAYMENT_USDT_PRICE
		let paymentToken  = await ICO_CONTRACT?.getPaymentToken(newCurrency);

		let paymentTokenAddress = paymentToken[0];
		console.log("paymentTokenAddress " + paymentTokenAddress);

		// is dynamic price
		let dynamicPrice = await ICO_CONTRACT?.gettDynamicPrice();
		console.log("dynamicPrice: " + dynamicPrice);
		setDynamicPrice(dynamicPrice);

		// work out price
		let uUSDprice: number = Number(paymentToken[2]);
		console.log("uUSDprice " + uUSDprice);
		setSelectedPaymentUSDPrice(uUSDprice / 10**6);
		if(dynamicPrice) {
			try {
				let dynPrice = await ICO_CONTRACT?.getUusdPerToken(newCurrency);
				console.log('dynPrice ' + dynPrice);
				setSelectedPaymentUSDPrice(dynPrice / 10**6);
			} catch (error) {
				console.error(error);
			}
		}

		let paymentTokenDecimals = Number(paymentToken[3]);
		console.log("paymentTokenDecimals " + paymentTokenDecimals);
		setSelectedPaymentDecimals(paymentTokenDecimals);

		// switch select box
		setSelectedPaymentCurrency(getSymbol(newCurrency));
		setSelectedPaymentIcon(PAYMENT_CURRENCIES.find(function (el) { return el.symbol === getSymbol(newCurrency); })?.icon);

		if(METAMASK_CURRENT_ACCOUNT) {
			if(newCurrency === 'COIN') {
				// calculate balance for COIN
				console.log("Showing balance for COIN.");
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				let result = await provider.getBalance(METAMASK_CURRENT_ACCOUNT);
				let balance = parseFloat(ethers.utils.formatEther(result));
				console.log("COIN balance: " + balance);
				setSelectedPaymentBalance(balance.toString());

			} else {
				// calculate balance for Token Payment Currencies
				console.log("Showing balance for: " + newCurrency);

				const provider = new ethers.providers.Web3Provider(window.ethereum)		
				const signer = provider.getSigner();
				const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);				
				let balanceWithDecimals = await paymentToken.balanceOf(METAMASK_CURRENT_ACCOUNT);
				let balance = balanceWithDecimals / 10**paymentTokenDecimals;
				console.log("balance " + balance);
				setSelectedPaymentBalance(balance.toString());

				// calculate allowance for this payment method
				calculateAllowance(newCurrency);
			}
		}
	}

	useEffect(() => {
		console.log("useEffect44", SELECTED_PAYMENT_CURRENCY);

		// update cygas amount to pay
		setAmountCygasToPay(USDAmountToCYGAS(TO_PURCHASE_AMOUNT_USD));

		// update raw amount to pay
		setAmountRawToPay(USDAmountToRaw(TO_PURCHASE_AMOUNT_USD));

	}, [SELECTED_PAYMENT_CURRENCY]);

	function cygasAmountToUSD(cygasAmount:number) {
		//console.log("cygasAmountToUSD", cygasAmount, cygasAmount * CFG_ICO_uUSDT_PRICE / 10**6 );
		return cygasAmount * CFG_ICO_uUSDT_PRICE / 10**6;
	}
	function USDAmountToCYGAS(usdAmount:number) {
		//console.log("USDAmountToCYGAS", usdAmount, usdAmount * 10**6 / CFG_ICO_uUSDT_PRICE);
		return usdAmount * 10**6 / CFG_ICO_uUSDT_PRICE;
	}

	function rawAmountToUSD(rawAmount:number) {
		//console.log("rawAmountToUSD", rawAmount, rawAmount * SELECTED_PAYMENT_USD_PRICE);
		return rawAmount * SELECTED_PAYMENT_USD_PRICE;
	}
	function USDAmountToRaw(usdAmount:number) {
		//console.log("USDAmountToRaw", usdAmount, usdAmount / SELECTED_PAYMENT_USD_PRICE);
		return Number(usdAmount / SELECTED_PAYMENT_USD_PRICE);
	}
	function USDAmountToRawWithDecimals(usdAmount:number, decimals:number) {
		console.log("USDAmountToRawWithDecimals");
		console.log("USDAmountToRawWithDecimals ", TO_PURCHASE_AMOUNT_USD);
		console.log("USDAmountToRawWithDecimals ", SELECTED_PAYMENT_USD_PRICE);
		console.log("USDAmountToRawWithDecimals ", USDAmountToRaw(TO_PURCHASE_AMOUNT_USD));
		let USDAmountToRawWithDecimals = BigInt(Math.round(USDAmountToRaw(TO_PURCHASE_AMOUNT_USD) * 10**decimals));
		//console.log("USDAmountToRawWithDecimals" + USDAmountToRawWithDecimals);
		return USDAmountToRawWithDecimals;
	}

	// ***********************************************************************************************
	// ************************************ Purchase Amount Updates **********************************
	// ***********************************************************************************************
	const [TO_PURCHASE_AMOUNT_USD, setAmountUSDToPurchase]=useState<number>(100);

	useEffect(() => {
		console.log("useEffect8", TO_PURCHASE_AMOUNT_USD);

		// update cygas amount to pay
		setAmountCygasToPay(USDAmountToCYGAS(TO_PURCHASE_AMOUNT_USD));

		// update raw amount to pay
		setAmountRawToPay(USDAmountToRaw(TO_PURCHASE_AMOUNT_USD));

	}, [TO_PURCHASE_AMOUNT_USD]);

	const [TO_PAY_CYGAS_AMOUNT, setAmountCygasToPay]=useState<number>(100*CFG_ICO_uUSDT_PRICE / 10**6);
	const [TO_PAY_RAW_AMOUNT, setAmountRawToPay]=useState<number>(100);
	useEffect(() => {
		console.log("useEffect9");
		if(!METAMASK_CURRENT_ACCOUNT) return;

		// notify not balance
		showMessage(Number(SELECTED_PAYMENT_BALANCE) * SELECTED_PAYMENT_USD_PRICE < TO_PURCHASE_AMOUNT_USD, MESSAGE_NOT_ENOUGHT_BALANCE);

	}, [TO_PURCHASE_AMOUNT_USD, SELECTED_PAYMENT_BALANCE, TO_PAY_RAW_AMOUNT, METAMASK_CURRENT_ACCOUNT]);

	// ***********************************************************************************************
	// **************************************** Approve Operation ************************************
	// ***********************************************************************************************
	const [IS_ACTION_APPROVING, setActionApproving]=useState<boolean>(false);

	async function calculateAllowance(currency:string) {
		// calculate allowance for this payment method
		let paymentToken  = await ICO_CONTRACT?.getPaymentToken(currency);
		let paymentTokenAddress = paymentToken[0];
		console.log("paymentTokenAddress " + paymentTokenAddress);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const token: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);

		let allowance = await token?.allowance(METAMASK_CURRENT_ACCOUNT, ICO_CONTRACT?.address);
		console.log(`SelectedPaymentAllowance: ${SELECTED_PAYMENT_CURRENCY} ${METAMASK_CURRENT_ACCOUNT} ${ICO_CONTRACT?.address} ${allowance} `);
		setSelectedPaymentAllowance(allowance);
	}

	const [HAS_ALLOWANCE, setHasAllowance] = useState<boolean>(false);
	useEffect(() => {
		console.log("useEffect64", );

		console.log("SELECTED_PAYMENT_DECIMALS: " + SELECTED_PAYMENT_DECIMALS);
		console.log("allowance existing: " + SELECTED_PAYMENT_ALLOWANCE.toString());
		let rawAmountWitDecimals = USDAmountToRawWithDecimals(TO_PURCHASE_AMOUNT_USD, SELECTED_PAYMENT_DECIMALS);
		console.log("allowance required: " + rawAmountWitDecimals);
		setHasAllowance(SELECTED_PAYMENT_ALLOWANCE >= rawAmountWitDecimals);

	}, [TO_PURCHASE_AMOUNT_USD, SELECTED_PAYMENT_ALLOWANCE]);

	// ***********************************************************************************************
	// **************************************** Purchase Operation ***********************************
	// ***********************************************************************************************
	const [IS_ACTION_PURCHASING, setActionPurchasing]=useState<boolean>(false);

	// click purchase
  async function approve(event:React.FormEvent) {
		event.preventDefault();

		let paymentCurrency: Array<string> = await ICO_CONTRACT?.getPaymentToken(SELECTED_PAYMENT_CURRENCY);
		console.log(paymentCurrency);
		let paymentTokenAddress = paymentCurrency[0];
		console.log("paymentTokenAddress " + paymentTokenAddress);
		let paymentTokenPrice = Number(paymentCurrency[2]);
		console.log("paymentTokenPrice " + paymentTokenPrice);
		let paymentTokenDecimals = Number(paymentCurrency[3]);
		console.log("paymentTokenDecimals " + paymentTokenDecimals);

		// calculate amount
		console.log("TO_PURCHASE_AMOUNT_USD " + TO_PURCHASE_AMOUNT_USD);
		console.log("SELECTED_PAYMENT_USD_PRICE " + SELECTED_PAYMENT_USD_PRICE);
		console.log("round " + round(TO_PURCHASE_AMOUNT_USD * 10**paymentTokenDecimals / SELECTED_PAYMENT_USD_PRICE, paymentTokenDecimals));
		let rawAmountWitDecimals = USDAmountToRawWithDecimals(TO_PURCHASE_AMOUNT_USD, paymentTokenDecimals);
		console.log("rawAmountWitDecimals " + rawAmountWitDecimals);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
		console.log("TO_PURCHASE_AMOUNT_USD " + TO_PURCHASE_AMOUNT_USD);
		console.log("paymentTokenPrice " + paymentTokenPrice);

		setActionApproving(true);
		await paymentToken?.approve(ICO_CONTRACT?.address, rawAmountWitDecimals).then(processApproveSuccess).catch(processApproveError);
	}
	async function processApproveSuccess(tx: any) {
		console.log(tx);

		const receipt = await tx.wait();
		setActionApproving(false);

		calculateAllowance(SELECTED_PAYMENT_CURRENCY);
	
		// catch events
		toast.success(`Amount Approved`, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

		handleICOReceipt(tx);
	}
	async function processApproveError(tx: any) {
		console.log(tx);

		setActionApproving(false);
		//const receipt = await tx.wait();

		handleError(tx);
	}

	// click purchase
  async function purchase(event:React.FormEvent) {
		event.preventDefault();

		console.log("purchasing " + SELECTED_PAYMENT_CURRENCY);
		if(SELECTED_PAYMENT_CURRENCY === getSymbol("COIN")) {
			let etherToBuy = TO_PURCHASE_AMOUNT_USD / SELECTED_PAYMENT_USD_PRICE;
			console.log("etherToBuy: " + etherToBuy);			

			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			await signer.sendTransaction({
				from: METAMASK_CURRENT_ACCOUNT,
				to: ICO_CONTRACT?.address,
				value: parseEther(etherToBuy.toString()),
				gasLimit: 1000000,
			})
			.then(processPurchaseSuccess).catch(procesPurchaseError);

		} else {
			let paymentCurrency: Array<string> = await ICO_CONTRACT?.getPaymentToken(SELECTED_PAYMENT_CURRENCY);
			console.log(paymentCurrency);
			let paymentTokenDecimals = Number(paymentCurrency[3]);
			console.log("paymentTokenDecimals " + paymentTokenDecimals);

			// calculate amount
			console.log("TO_PURCHASE_AMOUNT_USD " + TO_PURCHASE_AMOUNT_USD);
			console.log("SELECTED_PAYMENT_USD_PRICE " + SELECTED_PAYMENT_USD_PRICE);
			console.log("round " + round(TO_PURCHASE_AMOUNT_USD * 10**paymentTokenDecimals / SELECTED_PAYMENT_USD_PRICE, paymentTokenDecimals));
			let rawAmountWitDecimals = USDAmountToRawWithDecimals(TO_PURCHASE_AMOUNT_USD, paymentTokenDecimals);
			console.log("rawAmountWitDecimals " + rawAmountWitDecimals);

			setActionPurchasing(true);
			console.log("SELECTED_PAYMENT_CURRENCY: " + SELECTED_PAYMENT_CURRENCY);			
			await ICO_CONTRACT?.depositTokens(SELECTED_PAYMENT_CURRENCY, rawAmountWitDecimals).then(processPurchaseSuccess).catch(procesPurchaseError);
		}
	}
	async function processPurchaseSuccess(tx: any) {
		console.log(tx);

		const receipt = await tx.wait();
		setActionPurchasing(false);

		calculateAllowance(SELECTED_PAYMENT_CURRENCY);
	
		ICO_CONTRACT?.once('FundsReceived', function (_backer, _symbol, _amount, event) {
			console.log(`FundsReceived: ${_amount / 10**18} ${_symbol} deposited by ${_backer}`);

			updateBalances().then(()=>console.log("Updated balances"));
			
			toast.success(`FundsReceived: ${_amount  / 10**18} ${_symbol} deposited by ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(tx);
	}
	async function procesPurchaseError(tx: any) {
		console.log("procesPurchaseError");
		console.log(tx);
		setActionPurchasing(false);

		//const receipt = await tx.wait();

		handleError(tx);
	}

	// ***********************************************************************************************
	// ******************************************** Send KYC *****************************************
	// ***********************************************************************************************
  function sendEmail(e:any) {
    e.preventDefault();

    emailjs.sendForm('service_kjls05v', 'template_xcx5y5m', e.target, 'jyq-HM8EYTizFYiqm')
      .then((result) => {
					console.log(result.text);
					setSentKYC(true);
      }, (error) => {
          console.log(error.text);
      });
  }

	// ***********************************************************************************************
	// ****************************************** Token Operation ************************************
	// ***********************************************************************************************
	const [TOKEN_CONTRACT, setTokenContract] = useState<Contract>()

	const CFG_CYGAS_TOKEN = {
		type: 'ERC20',
		options: {
			address: TOKEN_CONTRACT?.address,
			symbol:  CFG_TOKEN_SYMBOL,
			decimals: CFG_TOKEN_DECIMALS,
			image: CFG_TOKEN_IMAGE
		}
	};
	const addToken = async () => {
		console.log(`TOKEN_CONTRACT: ${TOKEN_CONTRACT}`);
		if(!TOKEN_CONTRACT) return;

		window.ethereum.request({ method: 'wallet_watchAsset', params: CFG_CYGAS_TOKEN })
			.then(() => console.log('Thanks for adding CYGAS!'))
			.catch((error: Error) => console.log('Error adding CYGAS!'))
	}

	useEffect(() => {
		console.log("useEffect24");
		if(!TOKEN_CONTRACT) return;
		console.log(`TOKEN_CONTRACT: ${TOKEN_CONTRACT}`);

		ICO_CONTRACT?.owner()
			.then((icoOwner: number)=>{
				console.log(`icoOwner: ${icoOwner} `);

				TOKEN_CONTRACT?.allowance(icoOwner, ICO_CONTRACT?.address)
					.then((icoAllowance: number)=>{
						console.log(`icoAllowance: ${icoOwner} ${ICO_CONTRACT?.address} ${icoAllowance} `);
						setICOToClaim(icoAllowance > 0);
					});

				TOKEN_CONTRACT?.balanceOf(METAMASK_CURRENT_ACCOUNT)
					.then((balanceOf: number)=>{
						console.log(`balanceOf: ${balanceOf} `);
						const cygasInToken = balanceOf / 10**18;
						setCygasBalanceInToken(cygasInToken);
					});

			});

	}, [TOKEN_CONTRACT]);

	// ***********************************************************************************************
	// ***************************************** Refund Operation ************************************
	// ***********************************************************************************************
	const [ICO_TO_REFUND, setICOToRefund] = useState<boolean>(false)
	const [IS_ACTION_REFUNDING, setActionRefunding]=useState<boolean>(false);
	const [TO_REFUND_ICON, setToRefundIcon] = useState<JSX.Element | undefined>()
	const [TO_REFUND_CURRENCY, setToRefundCurrency] = useState<string>()
  const [TO_REFUND_DECIMALS, setToRefundDecimals] = useState<number>(10**6)
  const [TO_REFUND_AMOUNT, setToRefundAmount] = useState<number>(0)

	const onSelectToRefundCurrency = async (symbol: any)=>{
		setToRefundCurrency(symbol);
		setToRefundIcon(PAYMENT_CURRENCIES.find(function (el) { return el.symbol === getSymbol(symbol!); })?.icon);

		let paymentCurrency: Array<string> = await ICO_CONTRACT?.getPaymentToken(symbol);
		console.log(paymentCurrency);
		let paymentTokenAddress = paymentCurrency[0];
		console.log("paymentTokenAddress " + paymentTokenAddress);
		let paymentTokenPrice = Number(paymentCurrency[2]);
		console.log("paymentTokenPrice " + paymentTokenPrice);
		let paymentTokenDecimals = Number(paymentCurrency[3]);
		console.log("paymentTokenDecimals " + paymentTokenDecimals);
		setToRefundDecimals(paymentTokenDecimals);

		let contribution = await ICO_CONTRACT?.getContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contribution: ` + contribution);
		setToRefundAmount(contribution / 10**paymentTokenDecimals);
		setICOToRefund(contribution > 0);
	}

	async function refund(event:React.FormEvent) {
		console.log(`METAMASK_CURRENT_ACCOUNT: ${METAMASK_CURRENT_ACCOUNT}`);
		
		setActionRefunding(true);
		await ICO_CONTRACT?.refund(TO_REFUND_CURRENCY).then(processRefundSuccess).catch(handleError);
	}
	async function processRefundSuccess(tx: any) {

		const receipt = await tx.wait();
		setActionRefunding(false);

		ICO_CONTRACT?.once('FundsRefunded', function (_backer, _symbol, _amount, event) {
			console.log(`FundsRefunded: ${_amount / 10**TO_REFUND_DECIMALS} refunded to ${_backer}`);

			updateBalances().then(()=>console.log("Updated balances"));
			
			toast.success(`FundsRefunded: ${_amount / 10**TO_REFUND_DECIMALS} ${getSymbol(_symbol)} refunded to ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(tx);
	}

	// ***********************************************************************************************
	// ****************************************** Claim Operation ************************************
	// ***********************************************************************************************
	const [ICO_TO_CLAIM, setICOToClaim] = useState<boolean>(false)
	const [IS_ACTION_CLAIMING, setActionClaiming]=useState<boolean>(false);

  async function claim(event:React.FormEvent) {
		console.log(`METAMASK_CURRENT_ACCOUNT: ${METAMASK_CURRENT_ACCOUNT}`);
		
		setActionClaiming(true);
		await ICO_CONTRACT?.claim().then(processClaimSuccess).catch(handleError);
	}
	async function processClaimSuccess(tx: any) {

		const receipt = await tx.wait();
		setActionClaiming(false);

		ICO_CONTRACT?.once('FundsClaimed', function (_backer, _amount, event) {
			console.log(`FundsClaimed: ${ _amount / 10**18 } CYGAS claimed by ${_backer}`);

			updateBalances().then(()=>console.log("Updated balances"));
			
			toast.success(`FundsClaimed: ${ _amount / 10**18 } CYGAS claimed by ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(tx);
		setICOToClaim(false);
	}

	// ***********************************************************************************************
	// **************************************** General Operation ************************************
	// ***********************************************************************************************
	async function handleICOReceipt(tx:any) {
		console.log('handle tx');
		console.log(tx);

		// process transaction
		console.log(`Transaction hash: ${tx.hash}`);
		const receipt = await tx.wait();
		console.log(receipt);
	  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
		console.log(`Gas used: ${receipt.gasUsed.toString()}`);

		//parseError(err.message,);
		let msg = 'GasUsed: ' + receipt.gasUsed;
		toast.info(msg, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

		//populateICOContractData();
	}
	function handleError(err:any) {
		console.log('Ohhhh nooo');
		console.log(err);
		console.log(err.code);
		console.log('err.message: ' + err.message);

		console.log(parseError(err.message));
		toast.error(parseError(err.message), {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

		// show KYC
		if(err.message.indexOf('ERRD_MUST_WHI') > -1)
			setShowKYC(true);
	}

	function parseError(err:any) {
		if(err.indexOf('ERRW_OWNR_NOT') > -1) return 'Caller is not the owner';
		else if(err.indexOf('ERRP_INDX_PAY') > -1) return 'Wrong index';
		else if(err.indexOf('ERRD_MUST_ONG') > -1) return 'ICO must be ongoing';
		else if(err.indexOf('ERRD_MUSN_BLK') > -1) return 'Must not be blacklisted';
		else if(err.indexOf('ERRD_TRAS_LOW') > -1) return 'Transfer amount too low';
		else if(err.indexOf('ERRD_TRAS_HIG') > -1) return 'Transfer amount too high';
		else if(err.indexOf('ERRD_MUST_WHI') > -1) return 'Must be whitelisted';
		else if(err.indexOf('ERRD_INVT_HIG') > -1) return 'Total invested amount too high';
		else if(err.indexOf('ERRD_HARD_CAP') > -1) return 'Amount higher than available';
		else if(err.indexOf('ERRD_ALLO_LOW') > -1) return 'Insuffient allowance';
		else if(err.indexOf('ERRR_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRR_PASS_SOF') > -1) return 'Passed SoftCap. No refund';
		else if(err.indexOf('ERRR_ZERO_REF') > -1) return 'Nothing to refund';
		else if(err.indexOf('ERRR_WITH_REF') > -1) return 'Unable to refund';
		else if(err.indexOf('ERRC_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRC_NPAS_SOF') > -1) return 'Not passed SoftCap';
		else if(err.indexOf('ERRC_MISS_TOK') > -1) return 'Provide Token';
		else if(err.indexOf('ERRW_MUST_FIN') > -1) return 'ProvidICO must be finishede Token';
		else if(err.indexOf('ERRW_MISS_WAL') > -1) return 'Provide Wallet';
		else if(err.indexOf('ERRR_ZERO_WIT') > -1) return 'Nothing to withdraw';
		else if(err.indexOf('ERRR_WITH_BAD') > -1) return 'Unable to withdraw';
	
		return err;
	}

	// ***********************************************************************************************
	// *********************************************** UI ********************************************
	// ***********************************************************************************************
	// kyc
	const [SHOW_BALANCES, setShowBalances] = useState<boolean>(true);
  const [SHOW_MESSAGE, setShowMessage] = useState<boolean>(false);
	const [SHOW_MESSAGE_TEXT, setShowMessageText] = useState<string>(MESSAGE_DEFAULT);
	const [SHOW_KYC, setShowKYC] = useState<boolean>(false)
	const [SENT_KYC, setSentKYC] = useState<boolean>(false)

	const showMessage = (isShow: boolean, text: string) => {
    console.log("showMessage " + isShow + ' - ' + text);
    setShowMessage(isShow);
    setShowMessageText(text);
	}
	function round(num: number, decimals: number) {
		return  Math.round(num *10**decimals) / 10**decimals;
	}

	async function updateBalances() {
		console.log("Updating balances")
		console.log(METAMASK_CURRENT_ACCOUNT)
		console.log("SELECTED_PAYMENT_CURRENCY1 " + SELECTED_PAYMENT_CURRENCY)

		if(!METAMASK_CURRENT_ACCOUNT)
			return;

		// calculate CYGAS balance
		let uUSDToClaim: number = await ICO_CONTRACT?.getuUSDToClaim(METAMASK_CURRENT_ACCOUNT);
		let cygasBalance = uUSDToClaim / CFG_ICO_uUSDT_PRICE;
		console.log("Updated CygasBalance " + cygasBalance);
		setCygasBalanceInICO(cygasBalance);

		// calculate SELECTED_PAYMENT_CURRENCY balance
		let paymentToken = await ICO_CONTRACT?.getPaymentToken(SELECTED_PAYMENT_CURRENCY);
		let paymentTokenAddress = paymentToken[0];
		console.log("paymentTokenAddress." + paymentTokenAddress);
		let paymentTokenDecimals = Number(paymentToken[3]);
		console.log("paymentTokenDecimals." + paymentTokenDecimals);

		// calculate balance for COIN
		console.log("SELECTED_PAYMENT_CURRENCY2 " + SELECTED_PAYMENT_CURRENCY)
		if(SELECTED_PAYMENT_CURRENCY === getSymbol("COIN")) {
			console.log("Showing balance for COIN.");
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			provider.getBalance(METAMASK_CURRENT_ACCOUNT).then((result)=>{
				let balance = parseFloat(ethers.utils.formatEther(result));
				console.log("setting COIN balance " + round(balance, paymentTokenDecimals));
				setSelectedPaymentBalance(round(balance, paymentTokenDecimals).toString());
			}).catch((e)=>console.log(e))

		// calculate balance for Token Payment Currencies
		} else {
			console.log("Showing balance for: " + SELECTED_PAYMENT_CURRENCY);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
			let balanceWithDecimals = await paymentToken.balanceOf(METAMASK_CURRENT_ACCOUNT);
			let balance = balanceWithDecimals / 10**paymentTokenDecimals;
			console.log("balance " + balance);
			setSelectedPaymentBalance(balance.toString());
		}

	}
	
  return (
    <div className="App">
      <header className="App-header">

				<ToastContainer />				
				<Row>

					<Col className="h-100">
						<div className="bg-login p-4 m-4">
							<Row className="mb-3">
								<Col className="bg-label">Invest in CRYPTOGAS</Col>
							</Row>
							<Row className="mb-3"></Row>
							{!METAMASK_INSTALLED ?
							<Row className="mb-3">
								<Col>
									<Button variant="danger" className="w-100 bg-button-disconnect p-2 fw-bold" onClick={openMetamaskInstall}>You need to Install Metamask Wallet. Click to Open</Button>
								</Col>
							</Row>
							: "" }

							{ METAMASK_CURRENT_ACCOUNT ? 
								<Row><Col><Button className="w-100 bg-button p-3 fw-bold border-0" onClick={onClickDisconnect} disabled={!METAMASK_INSTALLED}>Disconnect</Button></Col></Row>
								: 
								<Row><Col><Button className="w-100 bg-button p-3 fw-bold border-0" onClick={onClickConnect} disabled={!METAMASK_INSTALLED}>Connect MetaMask</Button></Col></Row>
							}

							{METAMASK_CURRENT_ACCOUNT ? 
								<Row>
									<Col className="d-flex">
										<Form.Text className="bg-label fs-5 w-100">Connected To {METAMASK_CURRENT_ACCOUNT} </Form.Text>
										<span onClick={() => setShowBalances(!SHOW_BALANCES)}>{ EYE_ICON() } </span>
									</Col>
								</Row> 
							: "" }

							{METAMASK_CURRENT_ACCOUNT ? <Row className="mb-3"></Row> : "" }
							
							{METAMASK_CURRENT_ACCOUNT && METAMASK_CHAIN_ID !== 0x89 ? 
							<Row>
								<Col>
									<Button className="w-100 bg-button p-3 fw-bold border-0" onClick={switchToNetwork} disabled={!METAMASK_INSTALLED}>Change to Polygon</Button>
								</Col>
							</Row>
							: "" }

							<Row className="mb-3"></Row>

							<Row>
								<Col className="d-flex">
									<Form.Label className="text-start w-100 bg-label">You buy</Form.Label>
									<Form.Text className="bg-text text-end" >${TO_PURCHASE_AMOUNT_USD}</Form.Text>
								</Col>
								<Col xs={7} sm={5} md={4} ></Col>
							</Row>

							<Row className="ps-3" translate="no">
								<Col className="ps-0 pe-0"><input id="tokens" type="number" className="form-control-lg bg-input form-control" value={TO_PAY_CYGAS_AMOUNT} disabled={!METAMASK_CURRENT_ACCOUNT  || SHOW_KYC} onChange={(event) => setAmountUSDToPurchase(cygasAmountToUSD(Number(event.target.value))) } ></input></Col>
								<Col xs={7} sm={5} md={4} className="ps-0">
									<Dropdown onClick={function(e){addToken();}}>
										<Dropdown.Toggle id="dropdown-header" className="form-control-lg bg-input form-control btn-lg bg-yellow w-100 text-start ps-4 bg-span" >
											<div className="d-flex">
													{ CYGAS_ICON() }
												<span className="h2 my-auto ms-2 fw-bold">
														CYGAS
												</span>
											</div>
										</Dropdown.Toggle>
									</Dropdown>
								</Col>
							</Row>
							<Row className="gx-1">
								<Col><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={() => setAmountUSDToPurchase(cygasAmountToUSD(500))   }>+500</Button></Col>
								<Col><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={() => setAmountUSDToPurchase(cygasAmountToUSD(5000))  }>+5000</Button></Col>
								<Col><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={() => setAmountUSDToPurchase(cygasAmountToUSD(12500)) }>+12500</Button></Col>
								<Col><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={() => setAmountUSDToPurchase(cygasAmountToUSD(25000)) }>+25000</Button></Col>
								<Col><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={() => setAmountUSDToPurchase(cygasAmountToUSD(50000)) }>+50000</Button></Col>
							</Row>

							{METAMASK_CURRENT_ACCOUNT && SHOW_BALANCES ? <Row><Form.Text className="bg-label fs-5 w-100">You have <span translate="no"> { METAMASK_CURRENT_ACCOUNT_CYGAS_BALANCE_IN_TOKEN?.toString() } </span> CYGAS owned and <span translate="no"> {METAMASK_CURRENT_ACCOUNT_CYGAS_BALANCE_IN_ICO} </span> CYGAS to claim</Form.Text></Row> : "" }

							<Row className="mb-3"></Row>

							<Row>
								<Col className="d-flex"><Form.Label className="text-start w-100 bg-label">You pay</Form.Label><Form.Text className="bg-text text-end">${TO_PURCHASE_AMOUNT_USD}</Form.Text></Col>
								<Col xs={7} sm={5} md={4} ></Col>
							</Row>

							<Row className="ps-3" translate="no">
								<Col className="ps-0 pe-0"><input id="ether" type="number" className="form-control-lg bg-input form-control" value={ round(TO_PAY_RAW_AMOUNT, 6)} disabled={true}></input></Col>
								<Col xs={7} sm={5} md={4} className="ps-0">
									<Dropdown onSelect={switchPayment}>
										<Dropdown.Toggle id="dropdown-header" className="form-control-lg bg-input form-control btn-lg bg-yellow w-100 text-start ps-4 bg-span">
											<div className="d-flex">
													{ SELECTED_PAYMENT_ICON }
												<span className="h2 my-auto ms-2 fw-bold">
													{	SELECTED_PAYMENT_CURRENCY } { DOWN_ARROW() }
												</span>
											</div>
										</Dropdown.Toggle>

										<Dropdown.Menu className="w-100 py-0">
											{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
												return (
													<Dropdown.Item as="button" className="btn-lg bg-yellow w-100 text-start ps-4 bg-span py-2 fs-2" key={index} eventKey={item} active={SELECTED_PAYMENT_CURRENCY === item}>
														<span className="d-flex">
															{ PAYMENT_CURRENCIES.find(function (el) { return el.symbol === getSymbol(item); })?.icon }
															<span className="h2 my-auto ms-2 fw-bold">
																{ getSymbol(item) }&nbsp;&nbsp;&nbsp;
															</span>
														</span>
													</Dropdown.Item>
												);
											})}
										</Dropdown.Menu>
									</Dropdown>
								</Col>
							</Row>

							<Row className="gx-1">
								{PAYMENT_CURRENCIES.find(function (el) { return el.symbol === getSymbol(SELECTED_PAYMENT_CURRENCY); })?.amounts?.map((item: any, index: any) => {
									return (
										<Col key={item}><Button className="w-100 btn-sm bg-hints p-1 border-0" disabled={false} onClick={ () => setAmountUSDToPurchase(rawAmountToUSD(parseFloat(item))) }>+{item}</Button></Col>
									);
								})}
							</Row>

							{METAMASK_CURRENT_ACCOUNT && SHOW_BALANCES ? <Row><Form.Text className="bg-label fs-5 w-100">You have <span translate="no"> { round(parseFloat(SELECTED_PAYMENT_BALANCE), 6) } {SELECTED_PAYMENT_CURRENCY}</span></Form.Text></Row> : "" }

							{ SENT_KYC ? <Row><Col><Form.Text className="bg-text">We will review your details and update you by email. Please wait.</Form.Text></Col></Row> : ''}

							{ !METAMASK_CURRENT_ACCOUNT || !SHOW_MESSAGE ? <Row><Col><Form.Text className="bg-text">Tokens will be credited into your account at round end.</Form.Text></Col></Row> : ''}
							
							{ METAMASK_CURRENT_ACCOUNT ?
								<Toast className="w-100 align-items-center text-white bg-danger border-0 d-flex" show={SHOW_MESSAGE} delay={3000}>
									<Toast.Body>{SHOW_MESSAGE_TEXT}</Toast.Body>
									<button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowMessage(false)}></button>
								</Toast>
							: "" }							

							{ ICO_STATE == 0 ?
								<Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={ true } >PURCHASE</Button>
							: ICO_STATE == 1 && SELECTED_PAYMENT_CURRENCY == getSymbol("COIN") ?
								<Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT || SHOW_KYC } onClick={purchase}>PURCHASE { IS_ACTION_PURCHASING ? <Spinner as="span" animation="border"  role="status" aria-hidden="true" /> : '' } </Button>
							: ICO_STATE == 1 && SELECTED_PAYMENT_CURRENCY != getSymbol("COIN") ?
								<Row>
									<Col><Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || SHOW_KYC || HAS_ALLOWANCE } onClick={approve}> APPROVE { IS_ACTION_APPROVING ? <Spinner as="span" animation="border"  role="status" aria-hidden="true" /> : '' } </Button></Col>
									<Col><Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || SHOW_KYC || !HAS_ALLOWANCE } onClick={purchase}> PURCHASE { IS_ACTION_PURCHASING ? <Spinner as="span" animation="border"  role="status" aria-hidden="true" /> : '' } </Button></Col>
								</Row>
							: ICO_STATE == 2 ?
								<Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={ true } >PURCHASE</Button>
							: ICO_STATE == 3 && ICO_TOTAL_USD_INVESTED >= ICO_SOFT_CAP ?
								<Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT || !ICO_TO_CLAIM || METAMASK_CURRENT_ACCOUNT_CYGAS_BALANCE_IN_ICO == 0 } onClick={claim}>CLAIM { IS_ACTION_CLAIMING ? <Spinner as="span" animation="border"  role="status" aria-hidden="true" /> : '' } </Button>
							: ICO_STATE == 3 && ICO_TOTAL_USD_INVESTED < ICO_SOFT_CAP ?
								<Row className="ps-3 pt-3" translate="no">
									<Col xs={4} sm={4} md={4} className="ps-0">
										<Dropdown onSelect={onSelectToRefundCurrency}>
											<Dropdown.Toggle id="dropdown-header" className="form-control-lg bg-input form-control btn-lg bg-yellow w-100 text-start ps-4 bg-span" disabled={!METAMASK_CURRENT_ACCOUNT}>
												<div className="d-flex">
														{ TO_REFUND_ICON }
													<span className="h2 my-auto ms-2 fw-bold">
														{	getSymbol(TO_REFUND_CURRENCY!) } { DOWN_ARROW() }
													</span>
												</div>
											</Dropdown.Toggle>

											<Dropdown.Menu className="w-100 py-0">
												{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
													return (
														<Dropdown.Item as="button" className="btn-lg bg-yellow w-100 text-start ps-4 bg-span py-2 fs-2" key={index} eventKey={item} active={SELECTED_PAYMENT_CURRENCY === item}>
															<span className="d-flex">
																{ PAYMENT_CURRENCIES.find(function (el) { return el.symbol === getSymbol(item); })?.icon }
																<span className="h2 my-auto ms-2 fw-bold">
																	{ getSymbol(item) }&nbsp;&nbsp;&nbsp;
																</span>
															</span>
														</Dropdown.Item>
													);
												})}
											</Dropdown.Menu>
										</Dropdown>
									</Col>
									<Col xs={4} sm={4} md={4} className="ps-0 pe-0"><input id="ether" type="number" className="form-control-lg bg-input form-control" value={ round(Number(TO_REFUND_AMOUNT), 6)} disabled={true}></input></Col>
									<Col xs={4} sm={4} md={4} ><Button type="submit" className="form-control-lg bg-input form-control bg-button fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT || !ICO_TO_REFUND  } onClick={refund}>REFUND { IS_ACTION_REFUNDING ? <Spinner as="span" animation="border"  role="status" aria-hidden="true" /> : '' } </Button></Col>
								</Row>
							:
								''
							}

						</div>
					</Col>

					{ METAMASK_CURRENT_ACCOUNT ?
					<Collapse in={SHOW_KYC && !SENT_KYC} dimension="width" timeout={2000}>
						<Col className="h-100">
							<div className="bg-login p-4 m-4">
								<Row className="mx-0"><div className="mx-0 text-end" onClick={() => setShowKYC(false)}>{CROSS_ICON()}</div></Row>
								<Row>
									<Col className="bg-label">Verify your identity to participate in token sale</Col>
								</Row>
								<Row>
									<Col><Form.Text className="color-frame">To buy more than 200 you need to complete the KYC process</Form.Text></Col>
								</Row>
								<Row className="mb-3"></Row>
								<Row className="mb-3"></Row>
								<Row>
									<Form encType="multipart/form-data" method="post" onSubmit={sendEmail}>

										<FormControl type="hidden" name="wallet_address" className="form-control-lg bg-input" value={METAMASK_CURRENT_ACCOUNT}/>

										<Row>
											<Col>
												<Form.Label className="text-start w-100 bg-label">First Name</Form.Label>
												<FormControl required name="first_name" className="form-control-lg bg-input"/>
											</Col>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Last Name</Form.Label>
												<FormControl required name="last_name" className="form-control-lg bg-input"/>
											</Col>
										</Row>

										<Row className="mb-3"></Row>

										<Row>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Date of Birth</Form.Label>
												<FormControl required name="dob" type="date" className="form-control-lg bg-input"/>
											</Col>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Email Address</Form.Label>
												<FormControl required name="email_address" className="form-control-lg bg-input"/>
											</Col>
										</Row>

										<Row className="mb-3"></Row>

										<Row>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Full Address</Form.Label>
												<FormControl required name="full_address" className="form-control-lg bg-input"/>
											</Col>
										</Row>

										<Row className="mb-3"></Row>

										<Row>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Document Front</Form.Label>
												<Form.Control required name="front" type="file" size="lg" />
											</Col>
											<Col>
												<Form.Label className="text-start w-100 bg-label">Document Back</Form.Label>
												<Form.Control required name="back" type="file" size="lg" />
											</Col>
										</Row>

										<Row className="mb-3"></Row>

										<Row>
											<Col><Form.Text className="bg-text">{!METAMASK_CURRENT_ACCOUNT}</Form.Text></Col>
										</Row>

										<Button type="submit" className="w-100 mt-4 btn-lg bg-button p-3 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT}>VERIFY INVESTOR</Button>

									</Form>
								</Row>

							</div>
						</Col>
					</Collapse>
					: "" }

				</Row>
      </header>
    </div>
  );
}

export default App;
