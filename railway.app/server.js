require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const {
  createTeam,
  checkRiddleAns,
  createRiddles,
} = require("./src/controller");

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(helmet());
app.use(morgan("combined"));

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.json({ message: "welcome" });
});

app.post("/register", createTeam);
app.post("/checkRiddleAns", checkRiddleAns);
app.post("/riddles", createRiddles);

app.use((req, res, next) => {
  res.status(404).json({ message: "Does not exists" });
});

const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}`)
);
