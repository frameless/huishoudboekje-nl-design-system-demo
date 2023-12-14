import {Button, ButtonGroup, useBreakpointValue} from "@chakra-ui/react";
import fill from "fill-range";
import React, {useState} from "react";
import { useTranslation } from "react-i18next";

const defaultOptions = (t) => ({
	/* I18n: t("pagination.first"), t("pagination.previous"), t("pagination.next"), t("pagination.last") */
	pageSize: 10,
	pagesAround: 3,
	buttonLabels: {
		first: t("pagination.first"),
		previous: t("pagination.previous"),
		next: t("pagination.next"),
		last: t("pagination.last"),
	},
});

const usePagination = (options?: Partial<typeof defaultOptions>, customOnPaginationClick?) => {
	const {t} = useTranslation();
	const _options = {...defaultOptions(t), ...options};
	const isMobile = useBreakpointValue([true, true, true, false]);

	const pagesAround = isMobile ? 1 : _options.pagesAround;
	const [pageSize, setPageSize] = useState<number>(_options.pageSize);
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number | null | undefined>();
	const nPages = total ? Math.ceil(total / pageSize) : 0;

	const onPaginationClick = () => {
		if(customOnPaginationClick !== undefined){
			customOnPaginationClick();
		}
	}

	const fn = {
		goNext: () => {
			onPaginationClick();
			setPage(Math.min(page + 1, nPages));
		},
		goPrevious: () => {
			onPaginationClick();
			setPage(Math.max(page - 1, 1));
		},
		goPage: (pageNumber: number) => {
			onPaginationClick();
			setPage(Math.min(pageNumber, Math.max(pageNumber, 1)));
		},
		goFirst: () => {
			onPaginationClick();
			setPage(1);
		},
		goLast: () => {
			onPaginationClick();
			setPage(nPages);
		},
		navigation: () => {
			// nPages = 2, Page = 1, pagesAround = 3 > [1,2]
			if (nPages < pagesAround * 2) {
				return fill(1, nPages);
			}

			// nPages = 100, Page = 2, pagesAround = 3 > [1,2,3,4,5,6,7]
			if (page < pagesAround + 1) {
				return fill(1, pagesAround * 2 + 1);
			}

			// nPages = 100, Page = 99, pagesAround = 3 > [94,95,96,97,98,99,100]
			if (page > nPages - pagesAround) {
				return fill(nPages - pagesAround * 2, nPages);
			}

			return fill(
				Math.max(1, Math.max(page, pagesAround + 1) - pagesAround),
				Math.min(nPages, Math.min(page, nPages) + pagesAround),
			);
		},
	};

	const PaginationButtons = () => {
		if (!total) {
			return null;
		}

		return (
			<ButtonGroup size={"sm"} isAttached>
				<Button mr={0} colorScheme={"gray"} isDisabled={page === 1} onClick={fn.goFirst}>{_options.buttonLabels.first}</Button>
				<Button mr={0} colorScheme={"gray"} isDisabled={page === 1} onClick={fn.goPrevious}>{_options.buttonLabels.previous}</Button>
				{fn.navigation().map((p, i) => (
					<Button mr={0} w={"3em"} key={i} colorScheme={page === p ? "primary" : "gray"} onClick={() => fn.goPage(p)}>{p}</Button>
				))}
				<Button mr={0} colorScheme={"gray"} isDisabled={page === nPages} onClick={fn.goNext}>{_options.buttonLabels.next}</Button>
				<Button mr={0} colorScheme={"gray"} isDisabled={page === nPages} onClick={fn.goLast}>{_options.buttonLabels.last}</Button>
			</ButtonGroup>
		);
	};

	return {
		nPages,
		page, setPage,
		total, setTotal,
		pageSize, setPageSize,
		offset: Math.max(1, pageSize * (page - 1)),
		...fn,
		PaginationButtons,
	};
};

export default usePagination;
