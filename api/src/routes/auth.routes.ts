import { Router } from 'express'
import { SignIn, Signup } from '../controller/auth.controller'
const route = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post('/signup', Signup).post('/signin', SignIn)

export default route
