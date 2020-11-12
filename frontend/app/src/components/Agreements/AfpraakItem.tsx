import React, {useState} from "react";
import {Badge, Box, BoxProps, Button, IconButton, Stack} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {IAfspraak} from "../../models";
import {currencyFormat, Interval} from "../../utils/things";
import {useTranslation} from "react-i18next";

const AfspraakItem: React.FC<BoxProps & { afspraak: IAfspraak, onToggleActive?: (id: number) => void, onDelete?: (id: number) => void }> = ({afspraak: a, onToggleActive, onDelete, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	// const onClickEditButton = () => {};

	const intervalString = (): string => {
		const parsedInterval = Interval.parse(a.interval);

		if (!parsedInterval) {
			return t("interval.once");
		}

		const {intervalType: type, count} = parsedInterval;
		return t(`interval.every-${type}`, {count});
	};

	const onClickDeleteButton = () => {
		if (onDelete) {
			if (!deleteConfirm) {
				setDeleteConfirm(true);
				return;
			}

			onDelete(a.id);
		}
	};
	const onClickDeleteCancel = () => {
		setDeleteConfirm(false);
	}

	const onClickToggle = () => {
		if (onToggleActive) {
			onToggleActive(a.id)
		}
	};

	return (
		<Stack direction={isMobile ? "column" : "row"} alignItems={"center"} {...props}>
			<Box flex={1}>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Box>
			<Box flex={1}>{a.beschrijving}</Box>
			<Box flex={1} textAlign={"right"}>{currencyFormat.format(a.bedrag)}</Box>
			<Box flex={1}>{intervalString()}</Box>
			<Stack width={100} spacing={2} isInline justifyContent={"center"}>
				{onToggleActive ? (
					<Button size={"xs"} variantColor={a.actief ? "green" : "gray"} {...onToggleActive && {cursor: "pointer"}}
					        onClick={onClickToggle}>{a.actief ? t("actions.deactivate") : t("actions.activate")}</Button>
				) : (
					<Badge fontSize={"10px"} bg={a.actief ? "green.200" : "gray.200"}>{a.actief ? t("active") : t("inactive")}</Badge>
				)}
			</Stack>
			<Box width={75}>
				{/*<IconButton variant={"ghost"} size={"sm"} icon={"edit"} aria-label={t("actions.edit")} onClick={onClickEditButton} />*/}
				{onDelete && (<>
					<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? "check" : "delete"}
					            variantColor={deleteConfirm ? "red" : "gray"}
					            aria-label={t("actions.delete")} onClick={onClickDeleteButton} />
					{deleteConfirm && <IconButton variant={"solid"} size={"xs"} icon={"close"} variantColor={"gray"} ml={2}
												  aria-label={t("actions.delete")} onClick={onClickDeleteCancel} />}
				</>)}
			</Box>
		</Stack>
	);
};

export default AfspraakItem;