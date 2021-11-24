import {enumType} from "nexus";

const DayOfWeek = enumType({
	name: "DayOfWeek",
	members: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
});

export default DayOfWeek;