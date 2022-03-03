import {CloseIcon} from "@chakra-ui/icons";
import {Tag, TagLabel, TagRightIcon} from "@chakra-ui/react";
import React from "react";

type ZoektermTagProps = {
	onClick?: (zoekterm: string) => void,
	onClickDelete?: (zoekter: string) => void,
	children: string
};

// Todo: add Alert to confirm delete action (03-03-2022)
const ZoektermTag: React.FC<ZoektermTagProps> = ({onClick, onClickDelete, children}) => {
	const hasClickHandler = [typeof onClick, typeof onClickDelete].includes("function");
	const styles = {
		cursor: hasClickHandler ? "pointer" : "default",
		...hasClickHandler && {
			_hover: {
				bg: "gray.200",
			},
		},
	};

	return (
		<Tag {...styles} {...onClick && {onClick: () => onClick(children)}}>
			<TagLabel>{children}</TagLabel>
			{onClickDelete && <TagRightIcon boxSize={"10px"} as={CloseIcon} onClick={() => onClickDelete(children)} />}
		</Tag>
	);
};

export default ZoektermTag;