import { Router } from "express"
import customersRouter from "./customersRoute.js"
import gamesRouter from "./gamesRoute.js"
import rentalsRouter from "./rentalsRoute.js"

const router = Router()
router.use(customersRouter)
router.use(gamesRouter)
router.use(rentalsRouter)

export default router