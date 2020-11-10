import React, {useState} from "react";
import {Badge, Box, BoxProps, Stack} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {IAfspraak} from "../../models";
import {currencyFormat, Interval} from "../../utils/things";
import {useTranslation} from "react-i18next";

const AfspraakItem: React.FC<BoxProps & { afspraak: IAfspraak, refetch: VoidFunction }> = ({afspraak: a, refetch, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	// const toast = useToast();
	const [isActive] = useState<boolean>(a.actief);

	// const [toggleAfspraakActiefMutation] = useMutation(ToggleAfspraakActiefMutation);

	// const onToggleActive = (isActive: boolean) => {
	// 	toggleAfspraakActiefMutation({
	// 		variables: {
	// 			id: a.id,
	// 			gebruikerId: a.gebruiker.id,
	// 			actief: isActive
	// 		},
	// 	}).then(() => {
	// 		toast({
	// 			position: "top",
	// 			description: t("messages.agreements.toggleActive.successMessage"),
	// 			status: "success",
	// 		});
	// 		refetch();
	// 	}).catch(err => {
	// 		console.log(err);
	// 		toast({
	// 			position: "top",
	// 			title: t("messages.genericError.title"),
	// 			description: t("messages.genericError.description"),
	// 			status: "error",
	// 		});
	// 	});
	// }

	const intervalString = (): string => {
		const parsedInterval = Interval.parse(a.interval);

		if (!parsedInterval) {
			return t("interval.once");
		}

		const {intervalType: type, count} = parsedInterval;
		return t(`interval.every-${type}`, {count});
	};

	return (
		<Stack direction={isMobile ? "column" : "row"} {...props}>
			<Box flex={1}>{a.tegenrekening?.rekeninghouder || t("unknown")}</Box>
			<Box flex={1}>{a.beschrijving}</Box>
			<Box flex={1} textAlign={"right"}>{currencyFormat.format(a.bedrag)}</Box>
			<Box flex={1}>{intervalString()}</Box>
			<Stack spacing={2} isInline flex={1} alignItems={"center"}>
				<Badge fontSize={"10px"} bg={isActive ? "green.200" : "gray.200"}>{isActive ? t("active") : t("inactive")}</Badge>
			</Stack>
		</Stack>
	);
};

export default AfspraakItem;