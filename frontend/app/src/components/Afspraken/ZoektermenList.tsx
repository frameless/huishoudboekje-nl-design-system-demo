import {CloseIcon} from "@chakra-ui/icons";
import {Tag, TagLabel, TagRightIcon, Wrap, WrapItem, WrapProps} from "@chakra-ui/react";
import React from "react";

type ZoektermenListProps = WrapProps & {zoektermen: string[], onDeleteZoekterm?: (zoekterm) => void};

const ZoektermenList: React.FC<ZoektermenListProps> = ({zoektermen, onDeleteZoekterm, ...props}) => {
	const styles = {
		cursor: onDeleteZoekterm ? "pointer" : "default",
		...onDeleteZoekterm && {
			_hover: {
				bg: "gray.200",
			},
		},
	};

	return (
		<Wrap spacing={1} {...props}>
			{zoektermen.map((z, i) => (
				<WrapItem key={i}>
					<Tag {...styles}>
						<TagLabel>{z}</TagLabel>
						{onDeleteZoekterm && <TagRightIcon boxSize={"10px"} as={CloseIcon} onClick={() => onDeleteZoekterm(z)} />}
					</Tag>
				</WrapItem>
			))}
		</Wrap>
	);
};

export default ZoektermenList;