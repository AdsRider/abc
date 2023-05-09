
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

export type GenerateTransactionObject = {
  to: string;
  nonce: number;
  amount: string;
};

export type BeforeTransactionObject = {
  to: string;
  value: string;
  gas: number | string;
  nonce: number;
  data: string;
};

export type SignTransactionObject = {
  transaction: BeforeTransactionObject;
  privatekey: string;
};

export type TransactionDAO = {
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: 'ADS' | 'ETH' | 'KRW',
  block_hash: string;
};

export type BlockDAO = {
  hash: string;
  parent_hash: string;
  height: number;
  timestamp: string;
};
