import { Router } from 'express'
import transactionRoute from './Public/Transaction.routes'
import vendorRoute from './Public/Vendor.routes'
import meterRoute from './Public/Meter.routes'
import powerUnitRoute from './Public/PowerUnit.routes'
import userRoute from './Public/User.routes'

const router = Router()

router
    .use('/transaction', transactionRoute)
    .use('/vendor', vendorRoute)
    .use('/meter', meterRoute)
    .use('/powerunit', powerUnitRoute)
    .use('/user', userRoute)

export default router

