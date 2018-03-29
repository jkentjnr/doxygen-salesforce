

export default class GetSetProcessor {
	static transform(filedata) {
		// {.*get.*;.*set.*;.*}
		return filedata.replace(/{.*get.*;.*set.*;.*}/gi, ';');
	}
}