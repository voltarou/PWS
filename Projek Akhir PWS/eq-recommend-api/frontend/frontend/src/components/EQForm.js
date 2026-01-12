import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EQForm({ token, onSaved, onLogout, editData }) {
  // frekuensi dan keterangan
  const freqs = [
    { freq: "60Hz", desc: "Sub-bass" },
    { freq: "170Hz", desc: "Bass" },
    { freq: "310Hz", desc: "Low-mid" },
    { freq: "600Hz", desc: "Mid" },
    { freq: "1kHz", desc: "Upper-mid" },
    { freq: "3kHz", desc: "Presence" },
    { freq: "6kHz", desc: "Brilliance" },
    { freq: "12kHz", desc: "Treble" },
    { freq: "14kHz", desc: "High-treble" },
    { freq: "16kHz", desc: "Air" },
  ];

  const defaultEQ = freqs.reduce((acc, f) => ({ ...acc, [f.freq]: 0 }), {});

  const [iemName, setIemName] = useState("");
  const [genre, setGenre] = useState("");
  const [eqValues, setEqValues] = useState(defaultEQ);
  const [editingId, setEditingId] = useState(null);

  // isi form kalau editData ada
  useEffect(() => {
    if (editData) {
      setIemName(editData.name);
      setGenre(editData.genre || "");
      setEqValues(editData.eqValues || defaultEQ);
      setEditingId(editData.id);
    }
  }, [editData]);

  // cek token expired
  useEffect(() => {
    if (!token) return;
    try {
      const payload = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        alert("⚠️ Token expired, silakan login kembali.");
        onLogout && onLogout();
      }
    } catch {
      alert("⚠️ Token invalid, silakan login kembali.");
      onLogout && onLogout();
    }
  }, [token, onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3001/api/eq/${editingId}`,
          { name: iemName, genre, eqValues },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("EQ profile berhasil diupdate!");
      } else {
        await axios.post(
          "http://localhost:3001/api/eq",
          { name: iemName, genre, eqValues },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("EQ profile berhasil disimpan!");
      }

      setIemName("");
      setGenre("");
      setEqValues(defaultEQ);
      setEditingId(null);
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal simpan/update EQ");
      if (err.response?.status === 401) onLogout && onLogout();
    }
  };

  const handleFreqChange = (freq, value) => {
    setEqValues((prev) => ({ ...prev, [freq]: parseInt(value, 10) }));
  };

  const options = Array.from({ length: 25 }, (_, i) => i - 12); // -12 sampai +12

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={iemName}
        onChange={(e) => setIemName(e.target.value)}
        placeholder="IEM Name"
        required
      />
      <input
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
        {freqs.map(({ freq, desc }) => (
          <div key={freq} style={{ display: "flex", flexDirection: "column" }}>
            <label>
              {freq} ({desc})
            </label>
            <select value={eqValues[freq]} onChange={(e) => handleFreqChange(freq, e.target.value)}>
              {options.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button type="submit" style={{ marginTop: "20px" }}>
        {editingId ? "Update EQ" : "Save EQ"}
      </button>
    </form>
  );
}
