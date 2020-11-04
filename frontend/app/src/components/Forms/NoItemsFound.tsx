import React, { MouseEventHandler } from "react";
import { Button } from "@chakra-ui/core";
import DeadEndPage from "../DeadEndPage";

export const NoItemsFound = ({ onClick, buttonLabel, hint}: {
	onClick: MouseEventHandler<HTMLButtonElement>
	buttonLabel: string
	hint: string
}) => {
	return (
		<DeadEndPage message={hint}>
			<Button onClick={onClick} size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}>{buttonLabel}</Button>
		</DeadEndPage>
	);
};

export default NoItemsFound;