import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is missing");
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

const main = async () => {
	try {
		await migrate(drizzle(migrationClient, { logger: true }), {
			migrationsFolder: "src/lib/server/db/migrations"
		});

		await migrationClient.end();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();
