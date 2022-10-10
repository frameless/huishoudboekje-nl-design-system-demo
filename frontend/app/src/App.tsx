import {Box, Button, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spinner, Stack, Text, useTheme, VStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
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
import MenuIcon from "./components/shared/MenuIcon";
import PageNotFound from "./components/shared/PageNotFound";
import TwoColumns from "./components/shared/TwoColumns";
import UserStatus from "./components/shared/UserStatus";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import SignalenList from "./components/Signalen/SignalenList";
import StatusErrorPage from "./components/Status/StatusErrorPage";
import {dataLayerOptions} from "./config/dataLayer";
import {RouteNames} from "./config/routes";
import TestPage from "./TestPage";
import onPathChanged from "./utils/DataLayer/hooks/onPathChanged";
import useDataLayer from "./utils/DataLayer/useDataLayer";
import {useFeatureFlag, useInitializeFeatureFlags} from "./utils/features";
import useAuth from "./utils/useAuth";

const App = () => {
	const {t} = useTranslation();
	const {user, error, loading, reset, login} = useAuth();
	const theme = useTheme();
	const location = useLocation();
	const dataLayer = useDataLayer(dataLayerOptions);
	dataLayer.addHook(onPathChanged("PathChanged"));
	useInitializeFeatureFlags();
	const isSignalenEnabled = useFeatureFlag("signalen");

	if (error) {
		return (
			<StatusErrorPage error={error} />
		);
	}

	if (!user) {
		return (
			<TwoColumns>
				{loading ? (
					<Spinner size={"xl"} />
				) : (
					<Stack spacing={5} maxWidth={300} alignSelf={["center", null, null, "flex-start"]}>
						<Heading size={"sm"}>{t("messages.welcome", {tenantName: theme.tenantName})}</Heading>
						<Text fontSize={"sm"}>{t("messages.clickHereToContinue")}</Text>
						<Button colorScheme={"primary"} type={"submit"} onClick={() => login()}>{t("global.actions.login")}</Button>
					</Stack>
				)}
			</TwoColumns>
		);
	}
	else {
		/* Check if the user already visited a specific URL, and navigate there. */
		const referer = localStorage.getItem("hhb-referer");
		if (referer && location.pathname !== referer) {
			localStorage.removeItem("hhb-referer");
			window.location.href = referer;
			return null;
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
							<UserStatus name={user.name} role={user.email} />
							<Menu>
								<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} size={"sm"} aria-label={"Open menu"} />
								<MenuList>
									<MenuItem onClick={() => reset()}>{t("global.actions.logout")}</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					</Stack>

					<Routes>
						<Route path={"/"} element={<Outlet />}>
							<Route index element={<Navigate to={RouteNames.huishoudens} replace />} />
							<Route path={RouteNames.huishoudens} element={<Outlet />}>
								<Route path={":id"} element={<HuishoudenDetails />} />
								<Route index element={<HuishoudensList />} />
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
							<Route path={RouteNames.notFound} element={<PageNotFound />} />
							<Route path={"*"} element={<PageNotFound />} />
							<Route path={"/test"} element={<TestPage />} />
						</Route>
					</Routes>
				</Box>
			</HStack>
		</VStack>
	);
};

export default App;
