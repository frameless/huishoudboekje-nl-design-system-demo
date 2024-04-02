import {Badge, Flex, HStack, Stack, Switch, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import d from "../../utils/dayjs";
import useToaster from "../../utils/useToaster";
import { GetSignalsCountDocument, SignalData, useSignalSetIsActiveMutation } from "../../generated/graphql";
import { createSignalMessage } from "./SignalMessageHelper";

type SignalsListItemProps = {
	signal: SignalData,
	onUpdate: () => void
};

const SignalsListItem: React.FC<SignalsListItemProps> = ({signal, onUpdate}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const signalMessage = createSignalMessage(signal)

	const [setIsActive] = useSignalSetIsActiveMutation({
		fetchPolicy: 'no-cache',
		onCompleted: () =>{
			onUpdate()
		}, refetchQueries: [{query: GetSignalsCountDocument}]
	});

	const toggleSignalActive = (signal: SignalData) => {
		setIsActive({
			variables: {
				input: {
					id: signal.id,
					isActive: !signal.isActive
				}
			},
		}).then((result) => {
			const isActive = result.data?.Signals_SetIsActive?.isActive;
			if (isActive) {
				toast({success: t("messages.enableSignaalSuccess")});
			}
			else {
				toast({success: t("messages.disableSignaalSuccess")});
			}
		}).catch(err => {
			toast.closeAll();
			toast({error: err.message});
		});
	};


	return (
		<HStack justify={"center"}>
			<Stack spacing={1} width={"100%"}>
				<Text {...!signal.isActive && {
					color: "gray.500",
					textDecoration: "line-through",
				}}>
					{signalMessage}
				</Text>
				<Text fontSize={"sm"} color={"gray.500"}>
					{d.unix(signal.updatedAt ? signal.updatedAt : signal.createdAt).format("LL LT")}
				</Text>
			</Stack>
			<Flex justify={"center"}>
				<Badge colorScheme={signal.isActive ? "green" : "gray"}>{signal.isActive ? t("enabled") : t("disabled")}</Badge>
			</Flex>
			<Flex justify={"center"}>
				<Switch size={"sm"} isChecked={signal.isActive} onChange={() => toggleSignalActive(signal)} />
			</Flex>
		</HStack>
	);
};

export default SignalsListItem;
