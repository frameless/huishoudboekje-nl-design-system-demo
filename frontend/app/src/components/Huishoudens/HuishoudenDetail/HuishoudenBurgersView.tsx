import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Box,
	Button,
	Grid,
	IconButton,
	Stack,
	Text,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useHistory} from "react-router-dom";
import Routes from "../../../config/routes";
import {Burger, GetHuishoudenDocument, GetHuishoudensDocument, Huishouden, useDeleteHuishoudenBurgerMutation} from "../../../generated/graphql";
import {formatBurgerName, formatHuishoudenName} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import GridCard from "../../Layouts/GridCard";

const HuishoudenBurgerItem: React.FC<{huishouden: Huishouden, burger: Burger}> = ({huishouden, burger}) => {
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const alert = useDisclosure();
	const cancelRef = useRef<any>(null);
	const toast = useToaster();
	const {t} = useTranslation();

	const [deleteHuishoudenBurger] = useDeleteHuishoudenBurgerMutation({
		refetchQueries: [
			{query: GetHuishoudenDocument, variables: {id: huishouden.id!}},
			{query: GetHuishoudensDocument},
		],
	});

	const onClickDeleteBurgerFromHuishouden = (e) => {
		e.preventDefault();
		alert.onOpen();
	};

	const onConfirmDeleteBurgerFromHuishouden = () => {
		deleteHuishoudenBurger({
			variables: {
				huishoudenId: huishouden.id!,
				burgerIds: [burger.id!],
			},
		}).then(result => {
			toast({
				success: t("messages.huishoudenBurger.deleteSuccess", {burgerName: formatBurgerName(burger)}),
			});
			alert.onClose();

			/* Check if all burgers were removed from this Huishouden */
			if (huishouden.burgers?.filter(b => b.id !== burger.id).length === 0) {
				push(Routes.Huishoudens);
			}
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (<>
		<AlertDialog isOpen={alert.isOpen} onClose={alert.onClose} leastDestructiveRef={cancelRef}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
						{t("forms.huishoudens.deleteBurger.title")}
					</AlertDialogHeader>
					<AlertDialogBody>
						{t("forms.huishoudens.deleteBurger.confirmQuestion", {
							burgerName: formatBurgerName(burger),
							huishoudenName: formatHuishoudenName(huishouden),
						})}
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={alert.onClose}>
							{t("global.actions.cancel")}
						</Button>
						<Button colorScheme={"red"} onClick={onConfirmDeleteBurgerFromHuishouden} ml={3}>
							{t("global.actions.delete")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>

		<GridCard as={NavLink} justify={["flex-start", "center"]} to={Routes.Burger(burger.id)} position={"relative"}>
			{(huishouden.burgers || []).length > 1 && (
				<Box position={"absolute"} top={1} right={1}>
					<IconButton variant={"ghost"} size={"sm"} aria-label={t("global.actions.delete")} icon={<DeleteIcon />} onClick={onClickDeleteBurgerFromHuishouden} />
				</Box>
			)}
			<Stack direction={["row", "column"]} spacing={5} align={"center"} justify={["flex-start", "center"]}>
				<Avatar name={formatBurgerName(burger, true)} />
				<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}>
					<strong>{formatBurgerName(burger, true)}</strong>
				</Text>
			</Stack>
		</GridCard>
	</>);
};

const HuishoudenBurgersView: React.FC<{huishouden: Huishouden, onClickAddButton?: VoidFunction}> = ({huishouden, onClickAddButton}) => {
	const {t} = useTranslation();
	const burgers: Burger[] = huishouden.burgers || [];

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{onClickAddButton && (
				<Box>
					<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
						w={"100%"} h={"100%"} borderRadius={5} p={5} onClick={onClickAddButton}>{t("global.actions.add")}</Button>
				</Box>
			)}
			{burgers.map((b, i) => {
				return <HuishoudenBurgerItem key={i} huishouden={huishouden} burger={b} />;
			})}
		</Grid>
	);
};

export default HuishoudenBurgersView;