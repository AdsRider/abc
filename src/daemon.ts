import { connect } from './database/pool';
import { getBlock, getBlockNumber } from './network/jsonrpc';
import { getLatestBlockHeight } from './services/block';
import { sleep } from './util';

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
    const promise = Array.from({ length: diff, }, (_, index: number) => getBlock(topBlockHeight + index));
    const blocks = await Promise.all(promise);
    // const a = blocks.map(b => {
    //   b
    //   b.transactions.filter(x => x.to = '')
    // })
  }

};
