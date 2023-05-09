import fs from 'fs';
import path from 'path';
import Web3 from 'web3';
import { config } from '../config';

// Ads Coin Constants
export const web3 = new Web3(config.node_url);
export const chainId = 11155111;
export const decimal = 18;
export const tokenContractAddress = '0x71b7d7b137cfecf3c8cfce4cf3bba0bbf33c8faf';
export const tokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../abi.json'), 'utf-8'));
export const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);
