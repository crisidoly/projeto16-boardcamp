import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import { getCustomers, getCustomersById, postCustomers, putCustomerById } from "../controllers/customersController.js";
import { customerSchema } from "../schemas/customersSchema.js";


const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post("/customers", validateSchema(customerSchema), postCustomers);
customersRouter.put("/customers/:id", validateSchema(customerSchema), putCustomerById);

export default customersRouter;