import DataLayer from "./DataLayer";

const useDataLayer = (eventArray: Array<any>, hooks: ((dataLayer: DataLayer) => void)[]) => {
	const dataLayer = new DataLayer(eventArray);
	hooks.forEach(h => h(dataLayer));
};

export default useDataLayer;