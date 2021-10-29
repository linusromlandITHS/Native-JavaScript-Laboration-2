const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const ip = require('ip')

app.use(cors())

app.use(express.static("../website"));

//adds the apiRoutes to /api
app.use("/api", require("./routes/apiRoutes"));

app.listen(port, () => {
        console.log(`\nApp running at:\n- Local: \x1b[36mhttp://localhost:${ port }/\x1b[0m\n- Network \x1b[36mhttp://${ ip.address() }:${ port }/\x1b[0m\n\nTo run for production, run \x1b[36mnpm run start\x1b[0m`)
});