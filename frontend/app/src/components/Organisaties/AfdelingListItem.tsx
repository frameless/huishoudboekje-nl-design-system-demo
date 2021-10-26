import {DeleteIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay, Avatar,
	Box,
	Button,
	IconButton,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Afdeling, GetOrganisatieDocument, GetOrganisatiesDocument, useDeleteAfdelingMutation} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import GridCard from "../Layouts/GridCard";
import AfdelingModal from "./AfdelingModal";

const AfdelingListItem: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const modal = useDisclosure();
	const alert = useDisclosure();
	const toast = useToaster();
	const {t} = useTranslation();
	const {push} = useHistory();
	const cancelRef = useRef(null);

	const [deleteAfdeling] = useDeleteAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
			{query: GetOrganisatiesDocument},
		],
	});

	const onClickDeleteAfdeling = (e) => {
		e.stopPropagation();
		e.preventDefault();
		alert.onOpen();
	};

	const onConfirmDeleteAfdeling = () => {
		deleteAfdeling({
			variables: {
				afdelingId: afdeling.id!,
			},
		}).then(result => {
			toast({
				success: t("messages.afdelingen.deleteSuccess", {name: afdeling.naam}),
			});
			alert.onClose();

			push(Routes.Organisatie(afdeling.organisatie?.id));
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (<>
		<AfdelingModal afdeling={afdeling} disclosure={modal} />

		<AlertDialog isOpen={alert.isOpen} onClose={alert.onClose} leastDestructiveRef={cancelRef}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
						{t("forms.afdelingen.deleteAfdeling.title")}
					</AlertDialogHeader>
					<AlertDialogBody>
						{t("forms.afdelingen.deleteAfdeling.confirmQuestion", {
							name: afdeling.naam,
						})}
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={alert.onClose}>
							{t("global.actions.cancel")}
						</Button>
						<Button colorScheme={"red"} onClick={onConfirmDeleteAfdeling} ml={3}>
							{t("global.actions.delete")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>

		<GridCard justify={["flex-start", "center"]} onClick={() => modal.onOpen()} position={"relative"}>
			<Box position={"absolute"} top={1} right={1}>
				<IconButton variant={"ghost"} size={"sm"} aria-label={t("global.actions.delete")} icon={<DeleteIcon />} onClick={onClickDeleteAfdeling} />
			</Box>
			<Stack direction={["row", "column"]} spacing={5} align={"center"} justify={["flex-start", "center"]}>
				<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} title={afdeling.naam}>
					<strong>{afdeling.naam}</strong>
				</Text>
			</Stack>
		</GridCard>
	</>);
};

export default AfdelingListItem;