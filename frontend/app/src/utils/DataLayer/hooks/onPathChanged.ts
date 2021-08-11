import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import DataLayer from "../DataLayer";

const onPathChanged = (eventName: string) => {
	if (!eventName) {
		throw new Error("useOnPathChanged: Please provide an event name.");
	}

	return (dataLayer: DataLayer) => {
		const location = useLocation();

		useEffect(() => {
			dataLayer.push(eventName);
		}, [dataLayer, location.pathname]);
	};
};

export default onPathChanged;