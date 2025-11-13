import {defineConfig} from "tsdown";

export default defineConfig({
	entry    : [
		"src/schema/index.ts",
		"src/contract/index.ts",
		"src/util.ts",
		"src/errors.ts",
	],
	outDir   : "dist",
	target   : "es2022",
	sourcemap: true,
	dts      : true,
});
