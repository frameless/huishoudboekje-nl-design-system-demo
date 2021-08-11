import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export enum MatomoEvent {
	PathChanged = "PathChanged"
}

const mtm = window["_mtm"] || [];

const pushEvent = (event: MatomoEvent, payload = {}) => mtm.push({event, ...payload && {payload}});

const useOnPathChanged = () => {
	const location = useLocation();

	useEffect(() => {
		pushEvent(MatomoEvent.PathChanged);
	}, [location.pathname]);
};

export const useMatomo = () => {
	useOnPathChanged();
};