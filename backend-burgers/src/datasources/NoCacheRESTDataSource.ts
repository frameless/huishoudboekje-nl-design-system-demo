import {RESTDataSource} from "apollo-datasource-rest";
import {isDev} from "../utils/things";

// For some reason RESTDataSource has a built in cache that returns nothing after the first request.
// Every request should use a new instance but that doesn't seem to happen. This is a hack to get around that.
class NoCacheRESTDataSource extends RESTDataSource {
	cacheKey = 0;

	protected cacheKeyFor(request: Request): string {
		return String(this.cacheKey++);
	}
}

export default NoCacheRESTDataSource;