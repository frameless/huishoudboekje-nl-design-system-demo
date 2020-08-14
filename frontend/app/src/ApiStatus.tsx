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
				.then((data) => data.json())
				.then((data) => {
					console.log("data", data);

					if (data.body === "alive") {
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
