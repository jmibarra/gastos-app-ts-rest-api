import express, { Router } from "express";
import { isAuthenticated, isStatusOwner } from "../middlewares";
import { createNewStatus, deleteStatus, getAllStatusByOwner, getStatus, updateStatus } from "../controllers/status";

export default (router: express.Router) => {
    router.post('/status', isAuthenticated, createNewStatus);
    router.get('/status', isAuthenticated, getAllStatusByOwner);
    router.get('/status/:id', isAuthenticated, isStatusOwner, getStatus);
    router.delete('/status/:id', isAuthenticated, isStatusOwner, deleteStatus);
    router.patch('/status/:id', isAuthenticated, isStatusOwner, updateStatus);
}