import {Stack} from "@chakra-ui/core";
import React from "react";
import CustomerStatementMessages from "./CustomerStatementMessages";
import Transactions from "./Transactions";

const Banking = () => {
	return (
		<Stack spacing={5}>
			<CustomerStatementMessages />
			<Transactions />
		</Stack>
	);
};

export default Banking;