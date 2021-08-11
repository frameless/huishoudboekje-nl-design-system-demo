import {useMemo} from "react";
import DataLayer from "./DataLayer";

type DataLayerHook = (dataLayer: DataLayer) => void;

const useDataLayer = (hooks: DataLayerHook[], eventArray: Array<any> = []) => {
	const dataLayer = useMemo(() => new DataLayer(eventArray), [eventArray]);
	hooks.forEach(h => {
		h(dataLayer);
	});
};

export default useDataLayer;