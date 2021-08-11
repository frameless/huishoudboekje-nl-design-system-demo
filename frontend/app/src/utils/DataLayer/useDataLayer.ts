import {useMemo} from "react";
import DataLayer from "./DataLayer";
import {EventArray} from "./EventArray";

type DataLayerHook = (dataLayer: DataLayer) => void;

type UseDataLayer = DataLayer & {
	addHook: (hook: DataLayerHook) => void;
};

export type UseDataLayerOptions = {
	eventArray: EventArray
}

const useDataLayer = (options: UseDataLayerOptions): UseDataLayer => {
	const dataLayer = useMemo(() => new DataLayer(options.eventArray), [options.eventArray]);
	const addHook = (hook: DataLayerHook) => hook(dataLayer);
	return Object.assign(dataLayer, {
		addHook,
	});
};

export default useDataLayer;