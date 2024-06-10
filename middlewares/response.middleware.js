const responseMiddlewareWithError = (err, req, res, next) => {
    res.send({
        error: true,
        message: err.message
    });

};

const responseMiddleware = (req, res, next) => {
    res.status(200);
    res.send(res.body);
};

export {responseMiddleware, responseMiddlewareWithError};
