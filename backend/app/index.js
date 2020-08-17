const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");

const PORT = process.env.HHB_BACKEND_PORT || 3000;

router.get("/health", (req, res) => {
  return res.status(200).send(`alive`);
});
router.get("/", (req, res) => {
  return res.status(200).send(`Welcome to the API`);
});

app.use(cors());
app.use("/api", router);
app.get("/", (req, res) => {
  return res.status(200).send();
});

app.listen(PORT, () => {
  console.log(`App fired up on port ${PORT}.`);
});
