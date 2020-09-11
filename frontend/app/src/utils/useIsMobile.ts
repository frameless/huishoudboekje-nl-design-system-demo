import { useState } from "react";

const useIsMobile = (breakpoint = 650) => {
	const _isMobile = () => window.innerWidth < breakpoint;
	const [isMobile, setIsMobile] = useState(_isMobile());

	window.onresize = () => setIsMobile(_isMobile());

	return isMobile;
};

export default useIsMobile;