import {objectType} from "nexus";

const PageInfo = objectType({
	name: "PageInfo",
	definition: t => {
		t.int("start");
		t.int("limit");
		t.int("count");
	},
});

export default PageInfo;