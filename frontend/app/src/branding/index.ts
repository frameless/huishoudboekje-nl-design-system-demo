const tenantName = process.env.REACT_APP_TENANT_NAME || "sloothuizen";

const logo = require("./" + tenantName + "/logo.svg");
const theme = require("./" + tenantName + "/theme.ts").default;

const branding = {tenantName, theme, logo};

export {
	tenantName, theme, logo
}
export default branding;
