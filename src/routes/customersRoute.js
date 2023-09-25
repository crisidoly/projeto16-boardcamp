import { Router } from "express";
import { createCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customersController";
import validateSchema from "../middlewares/validateSchema.js";
import { customerSchema } from "../schemas/customersSchema.js";
import { validateCustomerId } from "../middlewares/validateCustomerId.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customersRouter;
