import React from "react";
import {Route} from "react-router-dom";
import Routes from "../../config/routes";
import CreateAgreement from "./CreateAgreement";

const Agreements = () => (<>
	<Route path={Routes.AgreementsNew} exact component={CreateAgreement} />
</>);

export default Agreements;