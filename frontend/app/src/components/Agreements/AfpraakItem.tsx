import {CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Badge, Box, BoxProps, Divider, IconButton, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Afspraak} from "../../generated/graphql";
import {currencyFormat2, XInterval} from "../../utils/things";
import GridCard from "../GridCard";

const AfspraakItem: React.FC<BoxProps & { afspraak: Afspraak, onDelete?: (id: number) => void }> = ({afspraak: a, onDelete, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {push} = useHistory();
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	const intervalString = (): string => {
		/* t("interval.every-day", { count }) t("interval.every-week", { count }) t("interval.every-month", { count }) t("interval.every-year", { count }) */
		const parsedInterval = XInterval.parse(a.interval);

		if (!parsedInterval) {
			return t("interval.once");
		}

		const {intervalType: type, count} = parsedInterval;
		return t(`interval.every-${type}`, {count});
	};

	const onClickDeleteButton = () => {
		if (onDelete && a.id) {
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

	const onClickEditButton = () => push(Routes.EditAgreement(a.id));

	return isMobile ? (
		<GridCard cursor={"default"} {...props}>
			<Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
				<Stack spacing={1} flex={1}>
					<Text>{a.beschrijving}</Text>
					<Text fontSize={"14px"} color={"gray.500"}>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Text>
				</Stack>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box flex={1}>{currencyFormat2().format(a.bedrag)}</Box>
					{a.automatischeIncasso && (
						<Box flex={1}>
							<Badge fontSize={"10px"}>{t("agreements.automatischeIncasso")}</Badge>
						</Box>
					)}
					<Box flex={1}>
						<Badge fontSize={"10px"}>{intervalString()}</Badge>
					</Box>
				</Stack>
			</Stack>
			{/*	Todo: edit and delete actions on mobile? (14-11-2020) */}
		</GridCard>
	) : (
		<Stack>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} py={5} {...props}>
				<Box flex={1}>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Box>
				<Box flex={1}>
					<Text color={"gray.600"}>{a.beschrijving}</Text>
				</Box>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box textAlign={"right"}>{currencyFormat2().format(a.bedrag)}</Box>
					{a.automatischeIncasso && <Badge fontSize={"10px"}>{t("agreements.automatischeIncasso")}</Badge>}
					<Badge fontSize={"10px"}>{intervalString()}</Badge>
				</Stack>
				<Box width={100}>
					<IconButton variant={"ghost"} size={"sm"} icon={<EditIcon />} aria-label={t("actions.edit")} onClick={onClickEditButton} />
					{onDelete && (<>
						{deleteConfirm && <IconButton variant={"solid"} size={"xs"} icon={<CloseIcon />} colorScheme={"gray"}
						                              mr={2} aria-label={t("actions.delete")} onClick={onClickDeleteCancel} />}
						<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? <CheckIcon /> : <DeleteIcon />}
						            colorScheme={deleteConfirm ? "red" : "gray"} aria-label={t("actions.delete")} onClick={onClickDeleteButton} />
					</>)}
				</Box>
			</Stack>

			<Divider />
		</Stack>
	);
};

export default AfspraakItem;