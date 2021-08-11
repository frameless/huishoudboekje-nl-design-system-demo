import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import DataLayer from "../DataLayer";
import {DataLayerEvent} from "../DataLayerEvent";

const useOnPathChanged = (dataLayer: DataLayer) => {
	const location = useLocation();

	useEffect(() => {
		dataLayer.push(DataLayerEvent.PathChanged);
	}, [dataLayer, location.pathname]);
};

export default useOnPathChanged;