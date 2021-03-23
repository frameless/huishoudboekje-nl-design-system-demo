import d from "dayjs";
import "dayjs/locale/nl";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import recur from "dayjs-recur";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekYear from "dayjs/plugin/weekYear";
import weekOfYear from "dayjs/plugin/weekOfYear";

d.locale("nl");
d.extend(localizedFormat);
d.extend(weekYear);
d.extend(weekOfYear);
d.extend(advancedFormat);
d.extend(relativeTime);
d.extend(isSameOrBefore);
d.extend(isSameOrAfter);
d.extend(customParseFormat);
d.extend(recur);
d.extend(quarterOfYear);

// Todo: temporary solution for missing Typescript support of dayjs-recur. (10-00-2021)
declare module "dayjs" {
	interface Dayjs {
		recur: Function
	}
}
export default d;