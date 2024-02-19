import { Router } from 'express'
import { IsAuthenticated } from 'src/middlewares/IsAuthenticated'

const route = Router()

route.post('/store/create', IsAuthenticated)

export default route
