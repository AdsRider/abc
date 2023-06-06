// 2023/06/02
// 변경사항 : 입출금 기록 보여줄시 +- 부호도 같이 보여줌
// 기존 special_log 데이터 보정필요

import { sql } from 'slonik';
import BigNumber from 'bignumber.js';
import { connect } from '../src/database/pool';
import { specialLogFragment, specialLogObject } from '../src/services/dw';

const patch = async () => {
    const pool = await connect();

    const result = await pool.transaction(async (conn) => {
        const specialLogList = await conn.any(sql.type(specialLogObject)`
            SELECT ${specialLogFragment}
            FROM special_log
        `);

        const needToPatch = specialLogList
            .filter((logObject) => ['이용권구매', '광고등록'].includes(logObject.memo))
            .map((l) => sql.unsafe`(${l.id}, ${l.memo}, ${new BigNumber(l.amount).negated().toFixed()}, ${l.user_email}, ${l.address}, ${l.hash}, ${new Date(l.timestamp).toISOString()})`);

        // unnest
        const patch = await conn.any(sql.type(specialLogObject)`
            INSERT INTO special_log
            VALUES ${sql.join(needToPatch, sql.fragment`, `)}
            ON CONFILCT (id)
                DO UPDATE SET amount = EXCLUDED.amount
        `);

        console.log(patch.length + ' row updated');
    });

    return result;
};
// patch();
