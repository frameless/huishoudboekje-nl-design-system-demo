const app = require('express')();
const PORT = 3000;

app.get('/health', (req, res) => {
    return res.status(200).send(`alive`);
})

app.listen(PORT, () => {
    console.log(`App fired up on port ${PORT}.`);
})