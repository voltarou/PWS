const express = require("express");
const { getEQProfiles, addEQProfile } = require("../controllers/eqController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/role");

const router = express.Router();

// Semua user bisa lihat
router.get("/profiles", auth, getEQProfiles);

// Hanya admin yang bisa tambah
router.post("/profiles", auth, checkRole(["admin"]), addEQProfile);

// nanti bisa tambahkan edit & delete
// router.put("/profiles/:id", auth, checkRole(["admin"]), editEQProfile);
// router.delete("/profiles/:id", auth, checkRole(["admin"]), deleteEQProfile);

module.exports = router;
