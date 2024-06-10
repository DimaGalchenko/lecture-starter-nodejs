import {Router} from "express";
import {fighterService} from "../services/fighterService.js";
import {responseMiddleware, responseMiddlewareWithError} from "../middlewares/response.middleware.js";
import {
    createFighterValid,
    updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.post('/', createFighterValid, (req, res, next) => {
    try {
        res.body = fighterService.create(req.body);
        next();
    } catch (e) {
        res.status(400);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

router.get('/:id', (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = fighterService.getById(id);
        next();
    } catch (e) {
        res.status(404);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

router.get('/', (req, res, next) => {
    res.body = fighterService.getAll();
    next();
}, responseMiddleware);

router.patch('/:id', updateFighterValid, (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = fighterService.updateById(id, req.body);
        next();
    } catch (e) {
        res.status(e.code);
        next(e);
    }
    next();
}, responseMiddleware, responseMiddlewareWithError);

router.delete('/:id', (req, res, next) => {
    let {id} = req.params;
    try {
        res.body = fighterService.deleteById(id);
        next();
    } catch (e) {
        res.status(404);
        next(e);
    }
}, responseMiddleware, responseMiddlewareWithError);

export {router};
