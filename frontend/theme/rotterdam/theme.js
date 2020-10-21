const tenantName = "Gemeente Rotterdam";

const primary = {
	50: "#e2fdec",
	100: "#bdf2cf",
	200: "#96e7b2",
	300: "#6ede94",
	400: "#46d477",
	500: "#2ebb5d",
	600: "#219148",
	700: "#166832",
	800: "#083e1d",
	900: "#001704",
};

const secondary = {
	50: "#ebefff",
	100: "#c9cfeb",
	200: "#a6aed9",
	300: "#838ec8",
	400: "#606eb8",
	500: "#46549e",
	600: "#37427c",
	700: "#262f59",
	800: "#161c37",
	900: "#060818",
};

window.branding = {
	tenantName,
	colors: {
		primary,
		secondary,
		green: primary,
		blue: secondary,
	},
};
