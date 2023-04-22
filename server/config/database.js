import { connect, set } from "mongoose"
import { mongo } from './keys.js'

set('strictQuery', true)

export default () => connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Database connected...'))
        .catch(err => console.log('Database Error:', err))
