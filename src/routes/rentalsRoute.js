import { Router } from "express"
import { createRental, deleteRental, getRentals, finishRental } from "../controllers/rentalsController.js"
import validateSchema from "../middlewares/validateSchema.js"
import { rentalSchema } from "../schemas/rentalsSchema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental)
rentalsRouter.post("/rentals/:id/return", finishRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter