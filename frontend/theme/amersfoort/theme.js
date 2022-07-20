const tenantName = "Gemeente Amersfoort";

const blue = {
	50: "#E0F7FF",
	100: "#BFE1F0",
	200: "#9BCBE3",
	300: "#75B6D6",
	400: "#51A1C9",
	500: "#3988B0",
	600: "#296A8A",
	700: "#1A4B63",
	800: "#0A2D3E",
	900: "#00101A",
};

const orange = {
	50: "#FFF2DA",
	100: "#FFDBAE",
	200: "#FFC57D",
	300: "#FFAE4B",
	400: "#FF961A",
	500: "#E67D00",
	600: "#B36100",
	700: "#814500",
	800: "#4F2900",
	900: "#1F0C00",
};

window.branding = {
	tenantName,
	colors: {
		primary: orange,
		secondary: blue,
		blue, orange,
	},
};
