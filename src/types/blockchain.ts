
export type Block = {
  hash: string;
  number: string;
  parentHash: string;
  timestamp: string; // '0x640ea404'
  transactions: Transaction[]
};

export type Transaction = {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxFeePerGas: string;
  hash: string;
  input: string | null;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
};

export type CurrencyType = 'ADS' | 'ETH' | 'KRW';
