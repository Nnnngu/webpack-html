import { readdirSync } from "fs";
import { resolve } from "path";
const files = readdirSync(resolve(__dirname, "../src"));
let entriesConfig = [];
files
	.filter(file => file)
	.forEach(file => {
		const file_name = file;
		entriesConfig.push({
			filename: file_name,
			entrUrl: `../src/${file_name}/index.js`,
			template: `src/${file_name}/index.html`
		});
	});
export default entriesConfig;
