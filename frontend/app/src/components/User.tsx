import React, {useState} from 'react';
import {Button, Icon, Input, Stack, Text, useToast} from "@chakra-ui/core";
import {useInput} from "react-grapple";
import {useTranslate} from "../config/i18n";
import users from "../config/users.json";
import IUser from "../models/IUser";

const User = () => {
	const {t} = useTranslate();
	const [currentUser, setCurrentUser] = useState<IUser | null>();
	const mail = useInput();
	const password = useInput();
	const toast = useToast();

	const onSubmit = (e) => {
		e.preventDefault();

		const user = users.find(u => u.email === mail.value && u.password === password.value);
		console.log(user);
		if (!user) {
			toast({
				description: t("login.invalidCredentialsError"),
				status: "error",
				position: "top",
			})
			return;
		}

		setCurrentUser(user);
	};

	const logout = () => setCurrentUser(null);

	return (
		<>
			{currentUser ? (
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Text>{t("welcomeMessage", {name: currentUser.firstName})}</Text>
					<Button onClick={logout} variantColor={"primary"} variant={"outline"}>
						<Icon name={"lock"} mr={3}/>
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
			)}
		</>
	);
};

export default User;