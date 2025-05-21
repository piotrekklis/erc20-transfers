import { transfersTable, jobsMonitorTable } from './db/schema';
import { db } from './db';
import { EventLog } from 'ethers';
import { provider, getContractTransfers, transferAbi } from './eth-adapter';
import { and, eq, desc, InferInsertModel } from 'drizzle-orm'
// import nodeCron from 'node-cron';

type Transfer = InferInsertModel<typeof transfersTable>;

async function saveTransfers(address: string, from: number, to: number) {

    const data = await getContractTransfers(address, from, to, transferAbi);

    if (data.length > 0) {

        console.log(`Saving ${data.length} Transfers for blocks ${from}:${to}`);
        const arr : Transfer[] = [];
        for (const event of data){
            const eventLog = <EventLog>event;
            arr.push({
                log_index: eventLog.index,
                transaction_hash: eventLog.transactionHash,
                transaction_index: eventLog.transactionIndex,
                block_number: eventLog.blockNumber,
                address: eventLog.address,
                from: eventLog.args[0].toLowerCase(),
                to: eventLog.args[1].toLowerCase(),
                value: String(Number(eventLog.args[2]) / 10**18),
            })
        }

        await db.insert(transfersTable).values(arr);
    
    } else {
        console.log(`No Transfers to save for blocks ${from}:${to}`);
    }

}

async function getLatestBlock() {
    const latestBlock = await provider.getBlockNumber();
    const lastParsableBlock = latestBlock - 12;
    return lastParsableBlock;
}

async function getAllTransfers(contract: string){

    const [lastParsedBlock] = await db
        .select()
        .from(jobsMonitorTable)
        .where(
            and(
                eq(jobsMonitorTable.job_name, "fetch_transfers"),
                eq(jobsMonitorTable.contract, contract)
            )
        )
        .orderBy(desc(jobsMonitorTable.saved_at))
        .limit(1);

    let start = lastParsedBlock?.to_block || 20663729;
    console.log(`Last parsed block: ${start}`);

    const end = await getLatestBlock();
    console.log(`Latest parsable block: ${end}`)

    while (start < end) {

        const fromBlock = start + 1;
        const toBlock = Math.min(start + 500, end);

        await saveTransfers(contract, fromBlock, toBlock);
        start += 500;

        const currentDate = Date.now()
        const savedAt = new Date(currentDate);

        await db
        .insert(jobsMonitorTable)
        .values({ 
            job_name: 'fetch_transfers',
            contract: contract,
            saved_at: savedAt,
            from_block: fromBlock,
            to_block: toBlock
        });

    }
}

getAllTransfers('0xdC035D45d973E3EC169d2276DDab16f1e407384F'.toLowerCase());

// const job = nodeCron.schedule("* * * * *", () => {
//     const timestamp = Date.now();
//     const currentDateTime = new Date(timestamp);
//     console.log(`Scheduling task at ${currentDateTime}`)
//     getAllTransfers('0xdC035D45d973E3EC169d2276DDab16f1e407384F'.toLowerCase());
// });
