import fs from 'node:fs';
import path from 'node:path';
import * as secp from '@noble/secp256k1';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { keccak_256 } from '@noble/hashes/sha3';
import axios from 'axios';
import { BlockChainRPC } from './types/method.types';
import { Config } from './types/config.types';

const config: Config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf-8'));

// TODO: config
const chainId = 11155111;
const decimal = 18;
const web3 = new Web3(config.node_url);

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
  const hexBlockNumber = blockNumber.toString(16);
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
    addres: '0x' + Buffer.from(hashKey.slice(-20)).toString('hex'),
    privateKey: '0x' + Buffer.from(privKey).toString('hex'),
  }
};

export const estimateGas = () => {

};

export const generateTransaction = (to: string, amount: string) => {

  // db getAddress, nonce(withdrawl count), pk
  const from = '0x687854520f018c003111993cb21c9b2b7a138781';
  const privateKey = '0cf853f772d4dea97b95887bbcedbe2049069f8912a1ed13556b2f1deaa30b3e';
  const nonce = 1;

  const transaction = {
    to: '0x42ccfe646cd08041734e2bed6019b19a18a79996',
    value: new BigNumber(amount).shiftedBy(decimal).toString(),
    gas: 21000,
    nonce: nonce,
    data: null,
    // optional data field to send message or execute smart contract
   };

   return transaction;
};

export const signTransaction = async (transaction: any, privateKey: string) => {
  const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);

  return signedTx;
};

(async () => {
  const from = '0x687854520f018c003111993cb21c9b2b7a138781';
  const privateKey = '0cf853f772d4dea97b95887bbcedbe2049069f8912a1ed13556b2f1deaa30b3e';
  const nonce = 1;
  const tx = generateTransaction('', '0.001');
  console.log(tx);
  const signedTx = await signTransaction(tx, privateKey);
  console.log(signedTx);
})();


// (async () => {
//   const url = process.env.node_uri ?? '';
//   const blockNumber = await call(url, 'eth_blockNumber', []);

//   const block = await call(url, 'eth_getBlockByNumber', [blockNumber as string, true]);
//   const transactions = block.transactions;
//   console.log(transactions)
// })();
