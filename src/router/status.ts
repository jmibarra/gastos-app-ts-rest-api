import express, { Router } from "express";
import { isAuthenticated, isOwner } from "../middlewares";
import { createNewStatus } from "../controllers/status";

export default (router: express.Router) => {
    router.post('/status', isAuthenticated, createNewStatus);
    //router.get('/expenses', isAuthenticated, getAllExpenses);
    //router.delete('/notes/:id', isAuthenticated, isOwner, dele);
    //router.patch('/notes/:id', isAuthenticated, isOwner, updateNote);
}