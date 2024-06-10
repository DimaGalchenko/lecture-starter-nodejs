import {Router} from "express";
import {userService} from "../services/userService.js";
import {
    createUserValid,
    updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import {responseMiddleware, responseMiddlewareWithError} from "../middlewares/response.middleware.js";

const router = Router();

router.post('/', createUserValid, (req, res, next) => {
    try {
        res.body = userService.create(req.body);
        next()
    } catch (e) {
        res.status(400);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

router.get('/:id', (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = userService.getById(id);
        next();
    } catch (e) {
        res.status(404);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

router.get('/', (req, res, next) => {
    res.body = userService.getAll();
    next();
}, responseMiddleware);

router.patch('/:id', updateUserValid, (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = userService.updateById(id, req.body);
        next();
    } catch (e) {
        res.status(e.code);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

router.delete('/:id', (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = userService.deleteById(id);
    } catch (e) {
        res.status(404);
        next(e);
    }
    next();
}, responseMiddleware, responseMiddlewareWithError)

export {router};
