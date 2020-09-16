import React from "react";
import {Button, Icon, Input, Stack, Text, useToast} from "@chakra-ui/core";
import {useInput} from "react-grapple";
import {useTranslate} from "../config/i18n";
import users from "../config/users.json";
import {useSession} from "../utils/hooks";
import {observer} from "mobx-react";

const User = () => {
	const {t} = useTranslate();
	const mail = useInput();
	const password = useInput();
	const toast = useToast();
	const session = useSession();

	const onSubmit = (e) => {
		e.preventDefault();

		// Todo: wrap this in an authService.ts once we start implementing actual IAM
		const user = users.find(u => u.email === mail.value && u.password === password.value);
		if (!user) {
			toast({
				description: t("login.invalidCredentialsError"),
				status: "error",
				position: "top",
			});
			return;
		}

		session.setUser(user);
	};

	const logout = () => session.reset();

	return session.user ? (
		<Stack direction={"row"} spacing={5} alignItems={"center"}>
			<Text>{t("welcomeMessage", {name: session.user.firstName})}</Text>
			<Button onClick={logout} variantColor={"primary"} variant={"outline"}>
				<Icon name={"lock"} mr={3} />
				{t("login.logout")}
			</Button>
		</Stack>
	) : (
		<form onSubmit={onSubmit}>
			<Stack spacing={5}>
				<Input {...mail.bind} placeholder={t("mail")} />
				<Input {...password.bind} type="password" placeholder={t("password")} />
				<Button variantColor={"primary"} type={"submit"}>Inloggen</Button>
			</Stack>
		</form>
	);
};

export default observer(User);