import React from "react";

type AfspraakDetailContextType = {
	addAfspraakZoekterm: (zoekterm: string, callback) => void;
	deleteAfspraak: () => void;
	deleteAfspraakZoekterm: (zoekterm: string) => void
};

const AfspraakDetailContext = React.createContext<AfspraakDetailContextType>({} as AfspraakDetailContextType);

export default AfspraakDetailContext;