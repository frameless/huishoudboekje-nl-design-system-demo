const tenantName = "Gemeente Nijmegen";

const primary = {
	50: "#FFE2F1",
	100: "#FFB1CF",
	200: "#FF7FAF",
	300: "#FF4D8F",
	400: "#FE1E6E",
	500: "#E50655",
	600: "#B30042",
	700: "#81002F",
	800: "#4F001C",
	900: "#20000A",
};

const secondary = {
	50: "#E1F9F9",
	100: "#C7E5E6",
	200: "#A9D2D3",
	300: "#8ABEC0",
	400: "#6BACAE",
	500: "#519294",
	600: "#3D7273",
	700: "#295253",
	800: "#133232",
	900: "#001313",
};

window.branding = {
	tenantName,
	colors: {
		primary,
		secondary,
		red: primary,
		green: secondary,
	},
};
