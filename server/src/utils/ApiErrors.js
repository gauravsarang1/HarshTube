class ApiError extends Error {
    constructor(
        statusCode = 500,
        message = 'Something went wrong',
        stack = '',
        errors = []
    ) {
        super(message); // Pass the message to Error constructor
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = null;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
