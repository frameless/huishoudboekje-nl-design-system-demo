import {Box} from "@chakra-ui/react";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Link} from "@gemeente-denhaag/link";
import React from "react";
import {useNavigate} from "react-router-dom";

const BackButton: React.FC<{ to?: string, label?: string }> = ({to, label}) => {
	const navigate = useNavigate();

	return (
		<Box onClick={() => navigate(to ? to : "/")} mb={3}>
			<Link icon={<ArrowLeftIcon />} iconAlign={"start"}>{label ? label : "Terug"}</Link>
		</Box>
	);
};

export default BackButton;
