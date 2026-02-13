import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // optional, makes queries faster
  // Increase timeout settings to handle longer queries
  connect_timeout: 30, // 30 seconds to establish a connection
  idle_in_transaction_session_timeout: 60000, // 60 seconds idle in transaction timeout
  statement_timeout: 30000, // 30 seconds statement timeout
});

export const db = drizzle(client);
