import { connect } from './database/pool';
import { getBlock, getBlockNumber } from './network/jsonrpc';
import BigNumber from 'bignumber.js';
import { getLatestBlockHeight } from './services/block';
import { TransactionDAO } from './types/blockchain';
import { sleep } from './util';
import { abiWithSignature, decimal, tokenContractAddress, web3 } from './util/constants';

type TransferInputData = {
  '0': string;
  '1': string;
  __length__: number;
  to: string;
  amount: string;
};

export const Daemon = async () => {
  const pool = await connect();

  // while (true) {
    //
    // const topBlockHeight = await getLatestBlockHeight(pool);
    // const blockHeight = await getBlockNumber();

    const topBlockHeight = 3437216;
    const blockHeight = 3437217;

    // if (blockHeight - topBlockHeight <= 0) {
    //   await sleep(6 * 1000);
    //   continue;
    // }

    const diff = Math.min(blockHeight - topBlockHeight, 100);
    const promise = Array.from({ length: diff, }, (_, index: number) => getBlock(blockHeight - index));
    const blocks = await Promise.all(promise);

    const refinedBlock = blocks.map(b => {
      const filteredTransactions = b.transactions
        .filter(tx => tx.to === tokenContractAddress)
        .map(tx => {
          const txDAO: TransactionDAO = {
            hash: tx.hash,
            block_hash: tx.blockHash,
            from: tx.from,
            to: '',
            amount: '0',
            type: 'ADS'
          };

          if (tx.input != null) {
            const functionSignature = tx.input.substring(0, 10);
            // transfer 인것만 체크 0xa9059cbb = transfer
            if (functionSignature == '0xa9059cbb') {
              const functionABI = abiWithSignature.find(x => x.signature.substring(0, 10) === functionSignature);
              if (functionABI != null && Array.isArray(functionABI.abi.inputs)) {
                const inputs = functionABI.abi.inputs.map(i => ({
                  name: i.name,
                  type: i.type,
                }));

                const contents = web3.eth.abi.decodeParameters(inputs, tx.input.substring(10)) as TransferInputData;

                txDAO.to = contents.to;
                txDAO.amount = new BigNumber(contents.amount).shiftedBy(decimal).toString();
              }
            }
          }

          return txDAO;
        });

      return {
        hash: b.hash,
        parent_hash: b.parentHash,
        number: parseInt(b.number, 16),
        timestamp: b.timestamp,
        transactions: filteredTransactions,
      }
    });
  // }

};
