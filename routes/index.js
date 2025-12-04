import express from "express";
import video from "./video.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("main");
});

router.use("/video", video);

// Not found
router.all("/*requestedPath", (req, res) => {
  console.log(req.params);
  const fullPath = req.params.requestedPath?.join("/");
  res.send(`not found (${fullPath || ""})`);
});

export default router;
