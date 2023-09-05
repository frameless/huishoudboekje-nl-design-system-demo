import "express-session";

// what we are all looking to solve xD
// req.session.propertyX
declare module "express-session" {
    interface SessionData {
        destroy: function;
    }
}