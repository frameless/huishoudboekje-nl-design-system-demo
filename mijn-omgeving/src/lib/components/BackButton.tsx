import React from "react";
import {Box} from "@chakra-ui/react";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {useNavigate} from "react-router-dom";

const BackButton: React.FC<{ to?: string, label?: string }> = ({to, label}) => {
	const navigate = useNavigate();

	return (
		<Box onClick={() => navigate(to ? to : "/")}>
			<Link icon={<ArrowLeftIcon />} iconAlign={"start"}>{label ? label : "Terug"}</Link>
		</Box>
	);
};

export default BackButton;