import { Block } from './blockchain';

const emptyParams = [] as const;

export type BlockChainRPC = {
  eth_blockNumber: {
    request: typeof emptyParams;
    response: string;
  },
  eth_getBlockByNumber: {
    request: [string, boolean]; // ['0xaa36a7', true]
    response: Block;
  },
  eth_sendRawTransaction: {
    request: [string];
    response: string; // transactionHash
  },
  eth_gasPrice: {
    request: typeof emptyParams;
    response: string; // hash ex) 0x5a5
  },
};
