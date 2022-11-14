import express from "express";
import helmet from "helmet";
import { config } from "dotenv";
import { createWriteStream } from "fs";
import routes from "./sources/routes/index.mjs";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import morgan from "morgan";

config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.MODE;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (mode === "PRODUCTION") {
	const accessLog = createWriteStream("./accessLog.txt", { flags: "a" });
	app.use(morgan("combined"), { stream: accessLog });
	app.disable("x-powered-by");
	app.use(helmet());
}

app.use("/", routes);
app.use((req, res) => {
	res.status(404).render("404.ejs", {});
});
app.use((err, req, res) => {
	console.log(err.message);
	res.status(500).render("500.ejs", {});
});

export default app;
