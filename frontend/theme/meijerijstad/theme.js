const tenantName = "Gemeente Meierijstad";

// 400/500 == meest gebruikt

// Meierijstad-lichtblauw
// RGB: 20/80/200 == #1450C8 180% **
// RGB: 30/100/210 == #1E64D2 160% **
// RGB: 40/120/215 == #2878D7 140% **
// RGB: 50/140/220 == #328CDC 120% **
// RGB: 75/166/223 == #4BA6DF 100%
// RGB: 111/184/229 == #6FB8E5 80%
// RGB: 130/204/232 == #82CCE8 75% **
// RGB: 165/210/239 == #A5D2EF 50%
// RGB: 180/219/240 == #B4DBF0 40% **
// RGB: 201/228/245 == #C9E4F5 30%

const meierijstad_lichtblauw = {
	50: "#C9E4F5", // 30 %
	100: "#B4DBF0", // 40 %
	200: "#A5D2EF", // 50 %
	300: "#82CCE8", // 75 %
	400: "#6FB8E5", // 80 %
	500: "#4BA6DF", // 100 %
	600: "#328CDC", // 120 %
	700: "#2878D7", // 140 %
	800: "#1E64D2", // 160 %
	900: "#1450C8", // 180 %
};

// Meierijstad-groen
// RGB: 60/111/30 == #3C6F1E 180% **
// RGB: 80/130/40 == #508228 160% **
// RGB: 100/159/50 == #649F32 140% **
// RGB: 123/168/59 == #7BA83B Schaduw/120%
// RGB: 142/187/56 == #8EBB38 100%
// RGB: 165/201/96 == #A5C960 80%
// RGB: 177/210/130 == #B1D282 75% **
// RGB: 198/221/155 == #C6DD9B 50%
// RGB: 210/227/175 == #D2E3AF 40%
// RGB: 221/234/195 == #DDEAC3 30%

const meierijstad_groen = {
	50: "#DDEAC3", // 30 %
	100: "#D2E3AF", // 40 %
	200: "#C6DD9B", // 50 %
	300: "#B1D282", // 75 %
	400: "#A5C960", // 80 %
	500: "#8EBB38", // 100 %
	600: "#7BA83B", // 120 %
	700: "#649F32", // 140 %
	800: "#508228", // 160 %
	900: "#3C6F1E", // 180 %
};

window.branding = {
	tenantName,
	colors: {
		primary: meierijstad_lichtblauw,
		secondary: meierijstad_groen,
	},
};
