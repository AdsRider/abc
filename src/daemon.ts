import { connect } from './database/pool';
import { getBlock, getBlockNumber } from './network/jsonrpc';
import BigNumber from 'bignumber.js';
import { getLatestBlockHeight, insertBlocks, insertTransactions } from './services/blockchain';
import { TransactionDAO } from './types/blockchain';
import { sleep } from './util';
import { abiWithSignature, decimal, tokenContractAddress, web3 } from './util/constants';
import { getAllAddress } from './services/address';
import { updateBalance, updateBalanceAndAvailable } from './services/balance';
import { getUserByAddress } from './services/users';

type TransferInputData = {
  '0': string;
  '1': string;
  __length__: number;
  to: string;
  amount: string;
};

export const Daemon = async () => {
  const pool = await connect();

  while (true) {
    const topBlockHeight = await getLatestBlockHeight(pool);
    const blockHeight = await getBlockNumber();

    if (blockHeight - topBlockHeight <= 0) {
      await sleep(6 * 1000);
      continue;
    }

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
                txDAO.amount = new BigNumber(contents.amount).shiftedBy(-decimal).toString();
              }
            }
          }

          return txDAO;
        });

      return {
        hash: b.hash,
        parent_hash: b.parentHash,
        number: parseInt(b.number, 16),
        timestamp: new Date(parseInt(b.timestamp, 16) * 1000).toISOString(),
        transactions: filteredTransactions,
      }
    });

    const blockDAOs = refinedBlock.map((b) => ({
      hash: b.hash,
      parent_hash: b.parent_hash,
      height: b.number,
      timestamp: b.timestamp,
    }));

    const transactionDAOs = refinedBlock.map(b => b.transactions).flat();

    const result = await pool.transaction(async (conn) => {
      const address = await getAllAddress(conn);

      await insertBlocks(conn, blockDAOs);
      const txs = await insertTransactions(conn, transactionDAOs);

      for (const t of txs) {
        const type = t.type;
        const fromAddress = address.find(x => x.address === t.from);
        const toAddress = address.find(x => x.address = t.to);
        const amount = new BigNumber(t.amount);

        if (fromAddress) {
          const user = await getUserByAddress(conn, fromAddress.address);
          const updatedBalance = await updateBalance(conn, user.email, 'ADS', amount.negated());
          // balance --
        }
        if (toAddress) {
          const user = await getUserByAddress(conn, toAddress.address);
          const updatedBalance = await updateBalanceAndAvailable(conn, user.email, 'ADS', amount);
          // balance ++
        }
      }

      return;
    });
  }
};
Daemon();
