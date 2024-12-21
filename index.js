const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const express = require("express");
const { config } = require("dotenv");
config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Berhasil!",
  });
});

// 1. CREATE Gudang
app.post("/gudang", async (req, res) => {
  const { nama, alamat, kapasitas } = req.body;
  try {
    const gudang = await prisma.gudang.create({
      data: { nama, alamat, kapasitas },
    });
    res.json(gudang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. READ Gudang (All & By ID)
app.get("/gudang", async (req, res) => {
  try {
    const gudangList = await prisma.gudang.findMany();
    res.json(gudangList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/gudang/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const gudang = await prisma.gudang.findUnique({
      where: { id: Number(id) },
    });
    if (!gudang) return res.status(404).json({ error: "Gudang not found" });
    res.json(gudang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. UPDATE Gudang
app.put("/gudang/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, kapasitas } = req.body;
  try {
    const updatedGudang = await prisma.gudang.update({
      where: { id: Number(id) },
      data: { nama, alamat, kapasitas },
    });
    res.json(updatedGudang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE Gudang
app.delete("/gudang/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gudang.delete({ where: { id: Number(id) } });
    res.json({ message: "Gudang deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
