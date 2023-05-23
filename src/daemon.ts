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
import { getWithdrawalByHash, updateWithdrawalStatus } from './services/dw';

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

    const diff = Math.min(blockHeight - topBlockHeight, 10);
    const promise = Array.from({ length: diff, }, (_, index: number) => getBlock(blockHeight - index));
    const blocks = await Promise.all(promise);

    const refinedBlock = blocks.map(b => {
      const filteredTransactions = b.transactions
        .filter(tx => tx.to === tokenContractAddress)
        .map(tx => {
          const txDAO: TransactionDAO = {
            hash: tx.hash,
            block_hash: tx.blockHash,
            from: tx.from.toLowerCase(),
            to: '',
            amount: '0',
            type: 'ADS',
            timestamp: new Date(parseInt(b.timestamp, 16) * 1000).toISOString(),
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

                txDAO.to = contents.to.toLowerCase();
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

      if (blockDAOs.length > 0) {
        await insertBlocks(conn, blockDAOs);
        console.log(`[info] block ${blockDAOs.length} updated last = ${blockDAOs[blockDAOs.length -1].height}`);
      }

      if (transactionDAOs.length > 0) {
        const txs = await insertTransactions(conn, transactionDAOs);
        console.log(`[info] ${transactionDAOs.length} ADS transaction found`);

        for (const t of txs) {
          const type = t.type;
          const fromAddress = address.find(x => x.address.toLowerCase() === t.from.toLowerCase());
          const toAddress = address.find(x => x.address.toLowerCase() === t.to.toLowerCase());
          const amount = new BigNumber(t.amount);

          if (fromAddress) {
            const withdrawal = await getWithdrawalByHash(conn, t.hash);
            if (withdrawal != null && withdrawal.status !== 'checked') {
              const updatedBalance = await updateBalance(conn, withdrawal.user_email, 'ADS', amount.negated());
              if (updatedBalance.amount < updatedBalance.available) {
                throw new Error('40b41b41-3c81-53ca-8a99-780ff0a4b262');
              }
              await updateWithdrawalStatus(conn, t.hash, 'checked');
              console.log(`[info] withdrawal ${withdrawal.user_email} balance updated`);
            }
            // balance --
          }
          if (toAddress) {
            const user = await getUserByAddress(conn, toAddress.address);
            const updatedBalance = await updateBalanceAndAvailable(conn, user.email, 'ADS', amount);
            // balance ++
            console.log(`[info] deposit ${user.email} balance updated`);
          }
        }
      }

      return;
    });
  }
};
Daemon();
