import * as secp from '@noble/secp256k1';
import BigNumber from 'bignumber.js';
import { keccak_256 } from '@noble/hashes/sha3';
import axios from 'axios';
import { BlockChainRPC } from '../types/method';
import { GenerateTransactionObject, SignTransactionObject } from '../types/blockchain';
import { decimal, tokenContract, tokenContractAddress, web3 } from '../util/constants';
import { config } from '../config';

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

export const generateADSTransaction = async (transactoinObject: GenerateTransactionObject) => {
  const {to, amount, nonce} = transactoinObject;
  const gasPrice = await web3.eth.getGasPrice();

  const transaction = {
    to: tokenContractAddress,
    value: '0',
    gas: gasPrice,
    gasLimit: 200000,
    nonce,
    data: tokenContract.methods.transfer(to, new BigNumber(amount).shiftedBy(decimal).toFixed()).encodeABI(),
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

export const getNonce = (address: string) => web3.eth.getTransactionCount(address);

export const withdrawalADScoin = async (from: string, to: string, amount: string, privatekey: string) => {
  const nonce = await getNonce(from);

  // build tx
  const transactionObject = {
    to,
    amount,
    nonce,
  };
  const transaction = await generateADSTransaction(transactionObject);

  // sign
  const signTransactionObject = {
    transaction,
    privatekey,
  };
  const signedTx = await signTransaction(signTransactionObject);

  // submit
  if (signedTx.rawTransaction == null) {
    throw new Error('4bc5ea6b-4cb7-5ae9-8ea9-deebe14484c0');
  }
  const txHash = await sendTransaction(signedTx.rawTransaction);

  return txHash;
};
