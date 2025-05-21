CREATE TABLE "monitor" (
	"job_name" varchar(256),
	"contract" varchar(42),
	"saved_at" timestamp,
	"from_block" bigint,
	"to_block" bigint
);
--> statement-breakpoint
CREATE TABLE "transfer" (
	"log_index" bigint,
	"transaction_hash" varchar(66),
	"transaction_index" bigint,
	"block_number" bigint,
	"address" varchar(42),
	"from" varchar(42),
	"to" varchar(42),
	"value" numeric(36, 18),
	CONSTRAINT "unique_event" UNIQUE("block_number","transaction_index","log_index")
);
