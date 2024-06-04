import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {SignalData} from "../../generated/graphql";
import SignalenListItem from "./SignalsListItem";

const SignalsList: React.FC<{signals: SignalData[], onUpdate: () => void}> = ({signals = [], onUpdate}) => {
	const {t} = useTranslation();

	if (signals.length === 0) {
		return (
			<Text></Text>
		);
	}

	const orderedSignals = signals.sort(compareSignal);

	function compareSignal(a: SignalData, b: SignalData) {
		const aCompareTime = a.updatedAt ?? a.createdAt
		const bCompareTime = b.updatedAt ?? b.createdAt

		if (aCompareTime < bCompareTime) {
			return 1
		}
		if (aCompareTime > bCompareTime) {
			return -1
		}
		return 0
	}

	return (
		<Stack minHeight={250} >
			{orderedSignals.map((signal) => (
				<SignalenListItem key={signal.id} signal={signal} onUpdate={onUpdate} />
			))}
		</Stack>
	);
};

export default SignalsList;