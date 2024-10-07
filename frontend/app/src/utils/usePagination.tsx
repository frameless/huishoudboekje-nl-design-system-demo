import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {Button, ButtonGroup, useBreakpointValue, HStack, Center, IconButton} from "@chakra-ui/react";
import fill from "fill-range";
import {useState} from "react";
import {useTranslation} from "react-i18next";
const defaultOptions = (t) => ({
	pageSize: 10,
	pagesAround: 3,
	iconOnly: false,
	colorScheme: "primary",
	buttonLabels: {
		first: t("pagination.first"),
		previous: t("pagination.previous"),
		next: t("pagination.next"),
		last: t("pagination.last")
	},
	startPage: 1
});

const usePagination = (options?: Partial<typeof defaultOptions>, customOnPaginationClick?, updateStartPage?) => {
	const {t} = useTranslation();
	const _options = {...defaultOptions(t), ...options};
	const isMobile = useBreakpointValue([true, true, true, false]);

	const pagesAround = isMobile ? 1 : _options.pagesAround;
	const [pageSize, setPageSize] = useState<number>(_options.pageSize);
	const [page, setPage] = useState<number>(_options.startPage);

	const [total, setTotal] = useState<number | null | undefined>();
	const nPages = total ? Math.ceil(total / pageSize) : 0;

	const onPaginationClick = () => {
		if (customOnPaginationClick !== undefined) {
			customOnPaginationClick();
		}
	}

	const updatePage = (value: number) => {
		if (updateStartPage !== undefined){
			updateStartPage(value)
		}
		setPage(value);
	}

	const fn = {
		goNext: () => {
			onPaginationClick();
			updatePage(Math.min(page + 1, nPages));
		},
		goPrevious: () => {
			onPaginationClick();
			updatePage(Math.max(page - 1, 1));
		},
		goPage: (pageNumber: number) => {
			onPaginationClick();
			updatePage(Math.min(pageNumber, Math.max(pageNumber, 1)));
		},
		goFirst: () => {
			onPaginationClick();
			updatePage(1);
		},
		goLast: () => {
			onPaginationClick();
			updatePage(nPages);
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

		if (nPages == 1) {
			return null;
		}

		return (
			<HStack justifyContent={"center"} verticalAlign={"center"} textAlign={"center"}>
				<ButtonGroup size={"sm"}>
					{_options.iconOnly &&
						<IconButton aria-label="previous" colorScheme={_options.colorScheme} variant={"ghost"} isDisabled={page === 1} onClick={fn.goPrevious}><ChevronLeftIcon boxSize={5} /></IconButton>
					}
					{!_options.iconOnly &&
						<Button colorScheme={_options.colorScheme} variant={"ghost"} isDisabled={page === 1} onClick={fn.goPrevious}><ChevronLeftIcon boxSize={5} /> {_options.buttonLabels.previous}</Button>}

					<Center>{t("pagination.pageText", {"page": page, "total": nPages})}</Center>
					{_options.iconOnly &&
						<IconButton aria-label="next" colorScheme={_options.colorScheme} variant={"ghost"} isDisabled={page === nPages} onClick={fn.goNext}><ChevronRightIcon boxSize={5} /></IconButton>
					}
					{!_options.iconOnly &&
						<Button colorScheme={_options.colorScheme} variant={"ghost"} isDisabled={page === nPages} onClick={fn.goNext}>{_options.buttonLabels.next} <ChevronRightIcon boxSize={5} /></Button>
					}
				</ButtonGroup>
			</HStack>
		);
	};

	return {
		nPages,
		page, updatePage,
		total, setTotal,
		pageSize, setPageSize,
		offset: Math.max(1, pageSize * (page - 1)),
		...fn,
		PaginationButtons,
	};
};

export default usePagination;
