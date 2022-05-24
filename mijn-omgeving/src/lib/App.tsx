import {ApolloProvider} from "@apollo/client";
import {ChakraProvider} from "@chakra-ui/react";
import React from "react";
import {MemoryRouter as Router, Outlet, Route, Routes} from "react-router-dom";
import BanktransactiesPage from "./components/Banktransacties";
import DetailBurgerView from "./components/Burger/DetailBurgerView";
import Dashboard from "./components/Dashboard";
import Toekomst from "./components/Toekomst/Toekomst";
import {HuishoudboekjeConfig, HuishoudboekjeUser} from "./models";
import createApolloClient from "./services/apolloClient";
import BanktransactieDetailPage from "./components/Banktransacties/BanktransactiesDetails/BanktransactieDetailPage";
import AfsprakenView from "./components/Afspraken/AfsprakenView";

const App: React.FC<{ user: HuishoudboekjeUser, config: HuishoudboekjeConfig }> = ({user, config}) => {
    const {apiUrl} = config;
    return (
        <ChakraProvider>
            <ApolloProvider client={createApolloClient({apiUrl})}>
                <Router>
                    <Routes>
                        <Route path={"/"} element={<Dashboard />} />
                        <Route path={"/banktransacties"} element={<Outlet />}>
                            <Route index element={<BanktransactiesPage bsn={user.bsn} />} />
                            <Route path={":id"} element={<BanktransactieDetailPage bsn={user.bsn} />} />
                        </Route>
                        <Route path={"/toekomst"} element={<Toekomst bsn={user.bsn} />} />
                        <Route path={"/gegevens"} element={<DetailBurgerView bsn={user.bsn} />} />
                        <Route path={"/afspraken"} element={<AfsprakenView bsn={user.bsn} />} />
                    </Routes>
                </Router>
            </ApolloProvider>
        </ChakraProvider>
    );
};

export default App;