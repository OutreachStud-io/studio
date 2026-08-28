import 'dotenv/config';
import {defineConfig} from 'drizzle-kit';

export default defineConfig({
	out          : './drizzle',
	schema       : '../../packages/dbschema/src/schema.ts',
	dialect      : 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URI!,
	},
});
