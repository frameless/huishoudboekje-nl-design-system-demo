import {Wrap, WrapItem} from "@chakra-ui/react";
import React from "react";
import ZoektermTag from "./ZoektermTag";

type ZoektermenListProps = {
	zoektermen: string[],
	onClick?: (zoekterm) => void
	onClickDelete?: (zoekterm) => void
};

const ZoektermenList: React.FC<ZoektermenListProps> = ({zoektermen, onClick, onClickDelete}) => {
	return zoektermen.length > 0 ? (
		<Wrap data-test="button.zoektermSuggestie" spacing={1}>
			{zoektermen.map((zoekterm, i) => (
				<WrapItem key={i}>
					<ZoektermTag
						onClick={onClick && (() => onClick(zoekterm))}
						onClickDelete={onClickDelete && (() => onClickDelete(zoekterm))}
					>
						{zoekterm}
					</ZoektermTag>
				</WrapItem>
			))}
		</Wrap>
	) : null;
};

export default ZoektermenList;