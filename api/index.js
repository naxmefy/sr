const express = require('express')

const app = module.exports = express()

app.get('/*', (req, res) => {
    res.send('holy API!!!')
})
