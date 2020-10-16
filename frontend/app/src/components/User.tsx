import React, { useEffect } from "react";
import {Button, Icon, Stack, Text, useToast} from "@chakra-ui/core";
import {observer} from "mobx-react";
import useFetch from "use-http";
import {useTranslate} from "../config/i18n";
import users from "../config/sampleData/users.json";
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
						description: t("errors.login.invalidCredentialsError"),
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

	// Todo: this should always render the form. Not the welcome message
	return !session.user ? (
		<form action="/api/login?page=/">
			<Stack spacing={5}>
				<Button variantColor={"primary"} type={"submit"}>{t("actions.login")}</Button>
			</Stack>
		</form>
	) : null;
};

export default observer(User);