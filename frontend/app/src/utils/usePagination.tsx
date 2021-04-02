import {Button, ButtonGroup} from "@chakra-ui/react";
import fill from "fill-range";
import React, {useState} from "react";

const defaultOptions = {
	pageSize: 10,
	pagesAround: 3,
	buttonLabels: {
		first: "First",
		previous: "Previous",
		next: "Next",
		last: "Last",
	},
};

const usePagination = (options?: Partial<typeof defaultOptions>) => {
	const _options = {...defaultOptions, ...options};
	const {pagesAround} = _options;

	const [pageSize, setPageSize] = useState<number>(_options.pageSize);
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>();
	const nPages = total ? Math.ceil(total / pageSize) : 0;

	const fn = {
		goNext: () => {
			setPage(Math.min(page + 1, nPages));
		},
		goPrevious: () => {
			setPage(Math.max(page - 1, 1));
		},
		goPage: (pageNumber: number) => {
			setPage(Math.min(pageNumber, Math.max(pageNumber, 1)));
		},
		goFirst: () => {
			setPage(1);
		},
		goLast: () => {
			setPage(nPages);
		},
		navigation: () => {
			// nPages = 100, Page = 2, pagesAround = 3 > [1,2,3,4,5,6,7]
			if (page < (pagesAround + 1)) {
				return fill(1, (pagesAround * 2) + 1);
			}

			// nPages = 100, Page = 99, pagesAround = 3 > [94,95,96,97,98,99,100]
			if (page > (nPages - pagesAround)) {
				return fill(nPages - (pagesAround * 2), nPages);
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
					<Button mr={0} w={"3em"} key={i} colorScheme={page === (p) ? "primary" : "gray"} onClick={() => fn.goPage(p)}>{p}</Button>
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
		offset: Math.max(1, (pageSize * (page - 1))),
		...fn,
		PaginationButtons,
	};
};

export default usePagination;