import { Block } from './blockchain.types';

const emptyParams = [] as const;

export type BlockChainRPC = {
  eth_blockNumber: {
    request: typeof emptyParams;
    response: string;
  },
  eth_getBlockByNumber: {
    request: [string, boolean]; // [0xaa36a7, true]
    response: Block;
  },
};
