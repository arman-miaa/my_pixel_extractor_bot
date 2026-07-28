"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => {
        return {
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages,
    };
};
exports.default = handleZodError;
