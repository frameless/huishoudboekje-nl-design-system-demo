import React from "react";

type AfspraakDetailContextType = {
	addAfspraakZoekterm: (zoekterm: string, callback) => void;
	deleteAfspraak: () => void;
	deleteAfspraakZoekterm: (zoekterm: string) => void,
	refetch: VoidFunction,
};

const AfspraakDetailContext = React.createContext<AfspraakDetailContextType>({} as AfspraakDetailContextType);

export default AfspraakDetailContext;