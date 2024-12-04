function sendResponse(res, status, data = null, message = null, error = null) {
    const response = {
        status: status.message,
        message: message || status.message,
    };

    if (data) {
        response.data = data;
    }

    if (error) {
        response.error = {
            code: status.code,
            details: error
        };
    }

    return res.status(status.code).json(response);
}

module.exports = sendResponse;