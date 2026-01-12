const express = require("express");
const router = express.Router();
const { getEQ, createEQ, updateEQ, deleteEQ } = require("../controllers/eqController"); // <-- gunakan getEQ
const auth = require("../middleware/auth");

router.get("/eq", auth, getEQ); // <-- sesuaikan nama
router.post("/eq", auth, createEQ);
router.put("/eq/:id", auth, updateEQ);
router.delete("/eq/:id", auth, deleteEQ);

module.exports = router;
