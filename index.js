import doxygen from 'doxygen';

(async () => {

	console.log('Download Doxygen');
	const data = await doxygen.downloadVersion();
	console.log(data);
	console.log('Download Doxygen: Done');

})();

