const { EQProfile, User } = require("../models");

// GET all EQ profiles
exports.getEQ = async (req, res) => {
  try {
    // ambil semua EQ milik admin + user sendiri
    const eqs = await EQProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "role"],
        },
      ],
    });

    res.json(
      eqs.map((p) => ({
        id: p.id,
        name: p.name,
        genre: p.genre,
        eqValues: p.eqValues,
        userId: p.userId,
        username: p.User.username,
        role: p.User.role,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil EQ profiles" });
  }
};

// CREATE new EQ
exports.createEQ = async (req, res) => {
  try {
    const { name, genre, eqValues } = req.body;

    const eq = await EQProfile.create({
      name,
      genre,
      eqValues,
      userId: req.user.id,
    });

    res.status(201).json(eq);
  } catch (err) {
    console.error("CREATE EQ ERROR:", err);
    res.status(500).json({ message: "Gagal simpan EQ" });
  }
};

// UPDATE EQ
exports.updateEQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genre, eqValues } = req.body;

    const eq = await EQProfile.findByPk(id);
    if (!eq) return res.status(404).json({ message: "EQ tidak ditemukan" });

    eq.name = name;
    eq.genre = genre;
    eq.eqValues = eqValues;

    await eq.save();
    res.json(eq);
  } catch (err) {
    console.error("UPDATE EQ ERROR:", err);
    res.status(500).json({ message: "Gagal update EQ" });
  }
};

// DELETE EQ
exports.deleteEQ = async (req, res) => {
  const id = req.params.id;

  try {
    const eq = await EQProfile.findByPk(id);
    if (!eq) return res.status(404).json({ message: "EQ tidak ditemukan" });

    await eq.destroy();
    res.json({ message: "EQ berhasil dihapus" });
  } catch (err) {
    console.error("DELETE EQ ERROR:", err);
    res.status(500).json({ message: "Gagal hapus EQ" });
  }
};
