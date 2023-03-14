import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import { BlockChainRPC } from './types/method.types';
import { Config } from './types/config.types';

const config: Config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf-8'));

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


// (async () => {
//   const url = process.env.node_uri ?? '';
//   const blockNumber = await call(url, 'eth_blockNumber', []);

//   const block = await call(url, 'eth_getBlockByNumber', [blockNumber as string, true]);
//   const transactions = block.transactions;
//   console.log(transactions)
// })();
