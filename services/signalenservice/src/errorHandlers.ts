import {ZodError} from "zod";

enum ErrorCodes {
	NotFound = "NotFound",
	AlreadyExists = "AlreadyExists",
	ValidationError = "ValidationError"
}

export class HttpError {
	status = 400;
}

export class NotFoundError extends HttpError {
	message = "Resource not found";
	errorCode = ErrorCodes.NotFound;
	status = 404;
}

export class AlreadyExistsError extends HttpError {
	message = "Resource already exists";
	errorCode = ErrorCodes.AlreadyExists;
}

export class ValidationError extends HttpError {
	message = "Invalid data given";
	errorCode = ErrorCodes.ValidationError;
	error;

	constructor(err: ZodError) {
		super();
		this.error = err.errors;
	}

}

export class UnknownError extends HttpError {
	message = "An unknown error occurred.";
	status = 500;

	constructor(err) {
		super();
		console.error("Unknown Error", {err});
	}

}

export const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}

	console.error("[ERROR]", err);

	const {
		message = "An unknown error occurred.",
		error,
	} = err;

	return res.status(err.status || 500).json({
		ok: false,
		message, error,
	});
};
