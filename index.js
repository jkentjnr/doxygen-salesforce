import fs from 'fs-extra';
import path from 'path';
import doxygen from 'doxygen';
import yargs from 'yargs';
import glob from 'glob';

import preprocessor from './preprocessors';

const downloadDoxygenIfRequired = async () => {
	console.log('Download Doxygen');
	if (fs.pathExistsSync('./node_modules/doxygen/dist') === false) {	
		await doxygen.downloadVersion();
		console.log('Download Doxygen: Done');
	}
	else {
		console.log('Download Doxygen: Already Exists');
	}
}

const getFiles = (pattern, options) => 
	new Promise((resolve, reject) => {
		glob(pattern, options || {}, (err, files)  => {
			if (err) { reject(err); return; }
			resolve(files);
		})
	});

// Command Line Arguments handler
const argv = yargs
    .option('n', { alias: 'name', demandOption: true, default: '\"Salesforce Project\"', describe: 'the name of the project', type: 'string' })
    .option('p', { alias: 'project', demandOption: true, default: './project/src', describe: 'the path to the Salesforce project', type: 'string' })
    .option('t', { alias: 'temp', demandOption: true, default: './tmp', describe: 'the path to the Temporary directory', type: 'string' })
    .help()
    .argv;

// Doxygen Options.
var userOptions = {
	PROJECT_NAME: argv.name,
	OUTPUT_DIRECTORY: "docs",
	INPUT: argv.temp,
	RECURSIVE: "YES",
	FILE_PATTERNS: ["*.cls", "*.trigger"],
	EXTENSION_MAPPING: ["js=Javascript", "cls=Java"],
	GENERATE_LATEX: "NO",
	EXTRACT_ALL: "YES",
	JAVADOC_AUTOBRIEF: "YES",
	EXCLUDE_PATTERNS: ["*/node_modules/*"]
};

(async () => {

	await downloadDoxygenIfRequired();

	if (fs.pathExistsSync(argv.project) === false) {
		console.log('Could not find project folder.');
		process.exit(1);
	}	

	const dirTemp = path.join(__dirname, argv.temp);
	await fs.emptyDir(dirTemp);
	await fs.copy(argv.project, dirTemp);

	const files = await getFiles(path.join(dirTemp, "**/*.cls"));
	for (let i = 0; i < files.length; i++) {
		await preprocessor.transform(files[i]);
	}

	doxygen.createConfig(userOptions);
	doxygen.run();

})();

