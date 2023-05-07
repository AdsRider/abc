import * as secp from '@noble/secp256k1';
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import BigNumber from 'bignumber.js';
import { keccak_256 } from '@noble/hashes/sha3';
import axios from 'axios';
import { BlockChainRPC } from '../types/method';
import { config } from '../config';
import { GenerateTransactionObject, SignTransactionObject } from '../types/blockchain';

// TODO: config
const chainId = 11155111;
const decimal = 18;
const web3 = new Web3(config.node_url);

const tokenContractAddress = '0x71b7d7b137cfecf3c8cfce4cf3bba0bbf33c8faf';
const tokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '/abi.json'), 'utf-8'));
const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

export const call = async <T extends keyof BlockChainRPC>(
  method: T,
  params: BlockChainRPC[T]['request'],
) => {
  const url = config.node_url;
  if (!url) {
    throw new Error('url env must be setted');
  }

  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: 'ar',
    method,
    params,
  });

  const response = await axios.post<{result: BlockChainRPC[T]['response']}>(url, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data.result;
};

export const getBlockNumber = async () => {
  const method = 'eth_blockNumber';
  const blockNumber = await call(method, []);

  // 유효성검사

  return parseInt(blockNumber, 16);
};

export const getBlock = async (blockNumber: number) => {
  const hexBlockNumber = '0x' + blockNumber.toString(16);
  const method = 'eth_getBlockByNumber';
  const block = await call(method, [hexBlockNumber, true]);

  return block;
};

export const generateAddress = () => {
  const privKey = secp.utils.randomPrivateKey();
  const pubKey = secp.getPublicKey(privKey);

  const slicedKey = pubKey.slice(1);
  const hashKey = keccak_256(slicedKey);

  return {
    address: '0x' + Buffer.from(hashKey.slice(-20)).toString('hex'),
    privatekey: '0x' + Buffer.from(privKey).toString('hex'),
  }
};

export const estimateGas = () => {

};

export const generateADSTransaction = (transactoinObject: GenerateTransactionObject) => {
  const {to, amount, nonce} = transactoinObject;

  const transaction = {
    to: tokenContractAddress,
    value: '0',
    gas: 21000,
    gasLimit: 50000,
    nonce,
    data: tokenContract.methods.transfer(to, new BigNumber(amount).shiftedBy(decimal).toString()).encodeABI(),
   };

   return transaction;
};

export const signTransaction = async (transactionObject: SignTransactionObject) => {
  const {transaction, privatekey} = transactionObject;
  const signedTx = await web3.eth.accounts.signTransaction(transaction, privatekey);

  return signedTx;
};

export const sendTransaction = async (rawTransaction: string) => {
  const method = 'eth_sendRawTransaction';
  const result = await call(method, [rawTransaction]);

  return result;
};
