import {chakra} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {QuestionOutlineIcon} from "@chakra-ui/icons";

const FirefoxIcon: React.FC<{ name: string }> = ({name}) => {
	const iconRef = React.useRef<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// I know, this is hacky as fuck, but it works. See https://stackoverflow.com/a/61472427/4073621 why.
		(import((`!!@svgr/webpack?-svgo,+titleProp,+ref!../assets/icons/${name}.svg`)))
			.then(result => {
				iconRef.current = result.default;
			})
			.catch(err => {
				console.error("DynamicIcon: icon not found.", err.message);
				iconRef.current = QuestionOutlineIcon;
			})
			.finally(() => {
				setLoading(false);
			});
	}, [name]);

	if (!loading) {
		const Icon = chakra(iconRef.current);
		return (
			<Icon flex={1} w={"100%"} h={"100%"} />
		);
	}

	return null;
};

export default FirefoxIcon;