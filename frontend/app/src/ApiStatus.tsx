import React, { useEffect, useState } from "react";

enum ApiStatusType {
	ALIVE = "Alive",
	DEAD = "Dead",
	UNKNOWN = "Loading...",
}

const ApiStatus = () => {
	const [apiStatus, setApiStatus] = useState<ApiStatusType>(ApiStatusType.UNKNOWN);

	useEffect(() => {
		setTimeout(() => {
			fetch("/api/health")
				.then(response => response.text())
				.then((data) => {
					if (data === "alive") {
						setApiStatus(ApiStatusType.ALIVE);
					} else {
						setApiStatus(ApiStatusType.DEAD);
					}
				})
				.catch((err) => setApiStatus(ApiStatusType.DEAD));
		}, 1000);
	});

	return (
		<div>
			<p>API status: {apiStatus}</p>
		</div>
	);
};

export default ApiStatus;
