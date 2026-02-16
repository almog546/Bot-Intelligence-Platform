const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadStrategy,getStrategies } = require("../controllers/strategyController");


router.post("/upload", upload.single("file"), uploadStrategy);
router.get("/all", getStrategies);




module.exports = router;
