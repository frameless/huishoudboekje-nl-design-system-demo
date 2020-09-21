import React, { useEffect } from "react";
import {Button, Icon, Stack, Text, useToast} from "@chakra-ui/core";
import {observer} from "mobx-react";
import useFetch from "use-http";
import {useTranslate} from "../config/i18n";
import users from "../config/users.json";
import {useSession} from "../utils/hooks";

const User = () => {
	const {t} = useTranslate();
	const toast = useToast();
	const session = useSession();
	const { get, response } = useFetch({ data: [] });

	useEffect(() => {
		const loadUser = async () => {
			const user = await get("/api/me");
			if (response.ok) {
				const dbuser = users.find(u => u.email === user.email);
				if (!dbuser) {
					toast({
						description: t("login.invalidCredentialsError"),
						status: "error",
						position: "top",
					});
					logout()
					return;
				}

				session.setUser(dbuser);
			}
		};
		loadUser();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const logout = async () => {
		session.reset();
		await get("/api/logout");
	};

	return session.user ? (
		<Stack direction={"row"} spacing={5} alignItems={"center"}>
			<Text>{t("welcomeMessage", {name: session.user.firstName})}</Text>
			<Button onClick={logout} variantColor={"primary"} variant={"outline"}>
				<Icon name={"lock"} mr={3} />
				{t("login.logout")}
			</Button>
		</Stack>
	) : (
		<form action="/api/login?page=/">
			<Stack spacing={5}>
				<Button variantColor={"primary"} type={"submit"}>Inloggen</Button>
			</Stack>
		</form>
	);
};

export default observer(User);