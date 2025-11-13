import {type SQLWrapper, sql} from "drizzle-orm";
import type {Logger} from "drizzle-orm/logger";
import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";

import * as schema from "@outreachstudio/dbschema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URI!,
});

class DbLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		console.log({query, params});
	}
}

export const db = drizzle({
	client: pool,
	schema: schema,
	logger: new DbLogger(),
});

// wrapper to run EXPLAIN ANALYZE on a query
export const explainAnalyze = async <T extends SQLWrapper>(
	sdb: typeof db,
	query: T,
) => {
	const debugResult = await sdb.execute(
		sql`EXPLAIN ANALYZE ${query.getSQL()}`,
	);
	console.debug(debugResult);
	return query;
};

export type TQueryParams = {
	explained: boolean;
};

export const query = async <T extends SQLWrapper>(
	query: T,
	p?: TQueryParams,
) => {
	if (p && p.explained) {
		return explainAnalyze(db, query);
	}
	return query;
};
