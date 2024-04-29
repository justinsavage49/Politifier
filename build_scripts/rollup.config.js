import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.dev === 'true';

export default [{
	input: 'src/background/service-worker.js',
	output: {
        intro: isDev 
        ? "const DEVELOPER_MODE = true;"
        : "const DEVELOPER_MODE = false;",
		file: '_build/background/service-worker.js',
		format: 'iife'
	},
	plugins: [
		nodeResolve(),
		terser()
	]
},
{
	input: 'src/content/swap-injector.js',
	output: {
        intro: isDev 
            ? "const DEVELOPER_MODE = true;"
            : "const DEVELOPER_MODE = false;",
		file: '_build/content/swap-injector.js',
		format: 'iife'
	},
	plugins: [
		nodeResolve(),
		terser()
	]
}];
