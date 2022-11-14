import Router from "express";

const routes = new Router();

routes.get("/", (req, res) => {
	res.status(200).render("index");
});
export default routes;
