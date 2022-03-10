import {Box, Button, Heading, HStack, IconButton, Spinner, Stack, Text, useTheme, VStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa";
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import BetaalinstructiePage from "./components/Afspraken/Betaalinstructie";
import CreateAfspraak from "./components/Afspraken/CreateAfspraak";
import EditAfspraak from "./components/Afspraken/EditAfspraak";
import FollowUpAfspraak from "./components/Afspraken/FollowUpAfspraak";
import ViewAfspraak from "./components/Afspraken/ViewAfspraak";
import CustomerStatementMessages from "./components/Bankzaken/Bankafschriften";
import Betaalinstructies from "./components/Bankzaken/Betaalinstructies";
import Transactions from "./components/Bankzaken/Transacties";
import BurgerDetailPage from "./components/Burgers/BurgerDetail";
import BurgerList from "./components/Burgers/BurgerList";
import BurgerPersonalDetailsPage from "./components/Burgers/BurgerPersonalDetailsPage";
import CreateBurger from "./components/Burgers/CreateBurger";
import EditBurger from "./components/Burgers/EditBurger";
import Configuratie from "./components/Configuratie";
import Gebeurtenissen from "./components/Gebeurtenissen";
import HuishoudenDetails from "./components/Huishoudens/HuishoudenDetail";
import HuishoudensList from "./components/Huishoudens/HuishoudensList";
import {AfdelingDetailPage} from "./components/Organisaties/AfdelingDetailPage";
import CreateOrganisatie from "./components/Organisaties/CreateOrganisatie";
import EditOrganisatie from "./components/Organisaties/EditOrganisatie";
import OrganisatieDetailPage from "./components/Organisaties/OrganisatieDetailPage";
import OrganisatieList from "./components/Organisaties/OrganisatieList";
import Rapportage from "./components/Rapportage";
import PageNotFound from "./components/shared/PageNotFound";
import TwoColumns from "./components/shared/TwoColumns";
import UserStatus from "./components/shared/UserStatus";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import SignalenList from "./components/Signalen/SignalenList";
import StatusErrorPage from "./components/Status/StatusErrorPage";
import StatusPage from "./components/Status/StatusPage";
import {dataLayerOptions} from "./config/dataLayer";
import {RouteNames} from "./config/routes";
import TestPage from "./TestPage";
import onPathChanged from "./utils/DataLayer/hooks/onPathChanged";
import useDataLayer from "./utils/DataLayer/useDataLayer";
import {useFeatureFlag, useInitializeFeatureFlags} from "./utils/features";
import useAuth from "./utils/useAuth";

const featureFlags = ["signalen"];

const App = () => {
	const {t} = useTranslation();
	const {user, error, loading, reset} = useAuth();
	const location = useLocation();
	const theme = useTheme();
	const dataLayer = useDataLayer(dataLayerOptions);
	dataLayer.addHook(onPathChanged("PathChanged"));
	useInitializeFeatureFlags(featureFlags);
	const isSignalenEnabled = useFeatureFlag("signalen");

	const onClickLoginButton = () => {
		/* Save the current user's page so that we can quickly navigate back after login. */
		localStorage.setItem("hhb-referer", location.pathname);
		window.location.href = "/api/login";
	};

	if (error) {
		return (
			<StatusErrorPage />
		);
	}

	if (!user) {
		return (
			<TwoColumns>
				{loading ? (
					<Spinner size={"xl"} />
				) : (
					<Stack spacing={5} maxWidth={300} alignSelf={["center", null, null, "flex-start"]}>
						<Heading size={"sm"}>{t("messages.welcome", {tenantName: theme["tenantName"]})}</Heading>
						<Text fontSize={"sm"}>{t("messages.clickHereToContinue")}</Text>
						<Button colorScheme={"primary"} type={"submit"} onClick={onClickLoginButton}>{t("global.actions.login")}</Button>
					</Stack>
				)}
			</TwoColumns>
		);
	}

	if (user) {
		/* Check if the user already visited a specific URL, and navigate there. */
		const referer = localStorage.getItem("hhb-referer");
		if (referer) {
			localStorage.removeItem("hhb-referer");
			return (<Navigate to={referer} />);
		}
	}

	return (
		<VStack h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
			<HStack width={"100%"} maxWidth={"1600px"} alignItems={"flex-start"} spacing={0}>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>

				<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>
					<Stack spacing={5} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
						<HStack spacing={5} alignItems={"center"}>
							<UserStatus name={user.email} />
							<IconButton size={"14px"} icon={
								<FaLock />} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("global.actions.logout")} mr={3} onClick={reset} />
						</HStack>
					</Stack>

					<Routes>
						<Route index element={<Navigate to={RouteNames.huishoudens} replace />} />
						<Route path={RouteNames.huishoudens} element={<Outlet />}>
							<Route index element={<HuishoudensList />} />
							<Route path={":id"} element={<HuishoudenDetails />} />
						</Route>
						<Route path={RouteNames.burgers} element={<Outlet />}>
							<Route index element={<BurgerList />} />
							<Route path={RouteNames.add} element={<CreateBurger />} />
							<Route path={":id"} element={<BurgerDetailPage />} />
							<Route path={`:id/${RouteNames.personal}`} element={<BurgerPersonalDetailsPage />} />
							<Route path={`:id/${RouteNames.edit}`} element={<EditBurger />} />
							<Route path={`:id/${RouteNames.afspraken}/${RouteNames.add}`} element={<CreateAfspraak />} />
						</Route>
						<Route path={RouteNames.afspraken} element={<Outlet />}>
							<Route path={":id"} element={<ViewAfspraak />} />
							<Route path={`:id/${RouteNames.edit}`} element={<EditAfspraak />} />
							<Route path={`:id/${RouteNames.betaalinstructie}`} element={<BetaalinstructiePage />} />
							<Route path={`:id/${RouteNames.followUp}`} element={<FollowUpAfspraak />} />
						</Route>
						<Route path={RouteNames.organisaties} element={<Outlet />}>
							<Route index element={<OrganisatieList />} />
							<Route path={RouteNames.add} element={<CreateOrganisatie />} />
							<Route path={":id"} element={<OrganisatieDetailPage />} />
							<Route path={`:id/${RouteNames.edit}`} element={<EditOrganisatie />} />
							<Route path={`:organisatieId/${RouteNames.afdelingen}/:id`} element={<AfdelingDetailPage />} />
						</Route>
						<Route path={RouteNames.bankzaken} element={<Outlet />}>
							<Route index element={<Navigate to={RouteNames.transacties} replace />} />
							<Route path={RouteNames.transacties} element={<Transactions />} />
							<Route path={RouteNames.bankafschriften} element={<CustomerStatementMessages />} />
							<Route path={RouteNames.betaalinstructies} element={<Betaalinstructies />} />
						</Route>
						{isSignalenEnabled && (
							<Route path={RouteNames.signalen} element={<SignalenList />} />
						)}
						<Route path={RouteNames.rapportage} element={<Rapportage />} />
						<Route path={RouteNames.gebeurtenissen} element={<Gebeurtenissen />} />
						<Route path={RouteNames.configuratie} element={<Configuratie />} />
						<Route path={RouteNames.status} element={<StatusPage />} />
						<Route path={RouteNames.notFound} element={<PageNotFound />} />
						<Route path={"*"} element={<PageNotFound />} />
						<Route path={"/test"} element={<TestPage />} />
					</Routes>
				</Box>
			</HStack>
		</VStack>
	);
};

export default App;