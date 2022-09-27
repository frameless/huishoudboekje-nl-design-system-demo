import {UseDataLayerOptions} from "../utils/DataLayer/useDataLayer";

export const dataLayerOptions: UseDataLayerOptions = {
	// @ts-ignore
	eventArray: window._mtm || [],
};
