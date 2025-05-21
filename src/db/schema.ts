import { pgTable, varchar, bigint, numeric, timestamp, unique} from "drizzle-orm/pg-core";

export const transfersTable = pgTable("transfer", {
    log_index:  bigint({ mode: 'number' }),
    transaction_hash: varchar({ length: 66 }),
    transaction_index:  bigint({ mode: 'number' }),
    block_number: bigint({ mode: 'number' }),
    address: varchar({ length: 42 }),
    from: varchar({ length: 42 }),
    to: varchar({ length: 42 }),
    value: numeric({ precision: 36, scale: 18 })
    }, (t) => [
        unique('unique_event').on(t.block_number, t.transaction_index, t.log_index)
    ]);

export const jobsMonitorTable = pgTable("monitor", {
    job_name: varchar({ length: 256 }),
    contract: varchar({ length: 42 }),
    saved_at: timestamp({ mode: "date" }),
    from_block: bigint({ mode: 'number' }),
    to_block: bigint({ mode: 'number' }),
});
