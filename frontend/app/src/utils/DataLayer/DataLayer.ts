import {DataLayerEvent} from "./DataLayerEvent";
import {EventArray} from "./EventArray";

class DataLayer {
	eventArray: EventArray;

	constructor(eventArray: EventArray) {
		this.eventArray = eventArray;
	}

	push(event: DataLayerEvent, payload = {}) {
		this.eventArray.push({
			event,
			...payload && {payload},
		});
	}
}

export default DataLayer;