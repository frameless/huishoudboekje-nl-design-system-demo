import React, {useState} from "react";
import {Badge, Box, BoxProps, Button, IconButton, Stack, Text} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {IAfspraak} from "../../models";
import {currencyFormat, Interval} from "../../utils/things";
import {useTranslation} from "react-i18next";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import GridCard from "../GridCard";

const AfspraakItem: React.FC<BoxProps & { afspraak: IAfspraak, onToggleActive?: (id: number) => void, onDelete?: (id: number) => void }> = ({afspraak: a, onToggleActive, onDelete, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {push} = useHistory();
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

	const onClickEditButton = () => push(Routes.EditAgreement(a.id));

	return isMobile ? (
		<GridCard cursor={"default"} {...props}>
			<Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
				<Stack spacing={1} flex={1}>
					<Text>{a.beschrijving}</Text>
					<Text fontSize={"14px"} color={"gray.500"}>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Text>
				</Stack>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box flex={1}>{currencyFormat.format(a.bedrag)}</Box>
					<Box flex={1}>
						<Badge fontSize={"10px"}>{intervalString()}</Badge>
					</Box>
				</Stack>
			</Stack>
			{/*	Todo: edit and delete actions on mobile? (14-11-2020) */}
		</GridCard>
	) : (
		<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props}>
			<Box flex={1}>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Box>
			<Box flex={1}>{a.beschrijving}</Box>
			<Stack spacing={1} flex={1} alignItems={"flex-end"}>
				<Box textAlign={"right"}>{currencyFormat.format(a.bedrag)}</Box>
				<Badge fontSize={"10px"}>{intervalString()}</Badge>
			</Stack>
			<Stack width={100} spacing={2} isInline justifyContent={"center"}>
				{onToggleActive ? (
					<Button size={"xs"} variantColor={a.actief ? "green" : "gray"} {...onToggleActive && {cursor: "pointer"}}
					        onClick={onClickToggle}>{a.actief ? t("actions.deactivate") : t("actions.activate")}</Button>
				) : (
					<Badge fontSize={"10px"} bg={a.actief ? "green.200" : "gray.200"}>{a.actief ? t("active") : t("inactive")}</Badge>
				)}
			</Stack>
			<Box width={75}>
				<IconButton variant={"ghost"} size={"sm"} icon={"edit"} aria-label={t("actions.edit")} onClick={onClickEditButton} />
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