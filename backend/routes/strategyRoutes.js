const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadStrategy,getStrategies,getStrategyTrades } = require("../controllers/strategyController");


router.post("/upload", upload.single("file"), uploadStrategy);
router.get("/all", getStrategies);
router.get("/:id/trades", getStrategyTrades);





module.exports = router;
