import {UseDataLayerOptions} from "../utils/DataLayer/useDataLayer";

export const dataLayerOptions: UseDataLayerOptions = {
	eventArray: window["_mtm"] || [],
};