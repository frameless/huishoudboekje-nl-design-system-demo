import {Link} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";

const AuditLogLink = (props) => <Link as={NavLink} variant={"inline"} {...props} />;

export default AuditLogLink;