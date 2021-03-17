import {CloseIcon} from "@chakra-ui/icons";
import {Tag, TagLabel, TagRightIcon, Wrap, WrapItem, WrapProps} from "@chakra-ui/react";
import React from "react";

type ZoektermenListProps = WrapProps & {zoektermen: string[], onChange: (val) => void};

const ZoektermenList: React.FC<ZoektermenListProps> = ({zoektermen, onChange, ...props}) => {
	return (
		<Wrap spacing={1} {...props}>
			{zoektermen.map((z, i) => (
				<WrapItem key={i}>
					<Tag _hover={{bg: "gray.200", cursor: "pointer"}}>
						<TagLabel>{z}</TagLabel>
						<TagRightIcon boxSize={"10px"} as={CloseIcon} onClick={() => onChange(zoektermen.filter(x => x !== z))} />
					</Tag>
				</WrapItem>
			))}
		</Wrap>
	);
};

export default ZoektermenList;