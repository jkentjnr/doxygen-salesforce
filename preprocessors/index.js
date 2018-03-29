import fs from 'fs-extra';

import getsetProcessor from './getsetProcessor';

const processorList = [
	getsetProcessor
];

export default class Processor {
	static async transform(filename) {
		console.log('Processor', filename, 'Pending');
		let filedata = await fs.readFile(filename, 'utf-8');

		for (let i = 0; i < processorList.length; i++) {
			const proc = processorList[i];
			filedata = proc.transform(filedata);
		}

		await fs.writeFile(filename, filedata, 'utf-8');
		console.log('Processor', filename, 'Complete');
	}
}