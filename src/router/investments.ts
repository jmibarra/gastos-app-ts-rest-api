import { Router } from "express";
import { isAuthenticated, isInvestmentOwner } from "../middlewares";
import { createNewInvestment, deleteInvestment, getAllInvestments, updateInvestment } from "../controllers";

export default (router: Router) => {
    router.get('/investments', isAuthenticated, getAllInvestments);
    router.post('/investments', isAuthenticated, createNewInvestment);
    router.patch('/investments/:id', isAuthenticated, isInvestmentOwner, updateInvestment);
    router.delete('/investments/:id', isAuthenticated, isInvestmentOwner, deleteInvestment);
}