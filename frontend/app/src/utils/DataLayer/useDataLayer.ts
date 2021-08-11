import { useMemo } from "react";
import DataLayer from "./DataLayer";

const useDataLayer = (eventArray: Array<any>, hooks: ((dataLayer: DataLayer) => void)[]) => {
	const dataLayer = useMemo(() => new DataLayer(eventArray), [eventArray]);
	hooks.forEach(h => h(dataLayer));
};

export default useDataLayer;