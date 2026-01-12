import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EQChart from "./EQChart";
import { jwtDecode } from "jwt-decode"; // versi terbaru

const EQList = ({ token, role, onEdit, onLogout }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);

  // urutan frekuensi agar konsisten
  const frequencyOrder = [
    "60Hz",
    "170Hz",
    "310Hz",
    "600Hz",
    "1kHz",
    "3kHz",
    "6kHz",
    "12kHz",
    "14kHz",
    "16kHz",
  ];

  // === Tambahan: fungsi untuk mendeskripsikan IEM berdasarkan EQ ===
  const describeIEM = (eqValues) => {
    const bassFreqs = ["60Hz", "170Hz", "310Hz", "600Hz"];
    const midFreqs = ["1kHz", "3kHz", "6kHz"];
    const trebleFreqs = ["12kHz", "14kHz", "16kHz"];

    const avg = (freqs) => {
      const vals = freqs.map((f) => eqValues[f] ?? 0);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const bass = avg(bassFreqs);
    const mid = avg(midFreqs);
    const treble = avg(trebleFreqs);

    const descriptions = [];

    if (bass > 5) descriptions.push("Bass-heavy");
    else if (bass < -5) descriptions.push("Bass-light");

    if (mid > 5) descriptions.push("Mid-forward");
    else if (mid < -5) descriptions.push("Mid-recessed");

    if (treble > 5) descriptions.push("Bright");
    else if (treble < -5) descriptions.push("Dark");

    if (descriptions.length === 0) descriptions.push("Balanced");

    return descriptions.join(", ");
  };
  // =================================================================

  // cek token valid
  const checkToken = useCallback(() => {
    if (!token) return false;
    try {
      const payload = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        alert("⚠️ Token expired, silakan login kembali.");
        onLogout && onLogout();
        return false;
      }
      return true;
    } catch {
      alert("⚠️ Token invalid, silakan login kembali.");
      onLogout && onLogout();
      return false;
    }
  }, [token, onLogout]);

  // ambil data EQ
  const fetchProfiles = useCallback(async () => {
    if (!checkToken()) return;

    try {
      const res = await axios.get("http://localhost:3001/api/eq", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.map((p) => ({
        ...p,
        eqValues:
          typeof p.eqValues === "string" ? JSON.parse(p.eqValues) : p.eqValues,
      }));

      setProfiles(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Token tidak valid / expired. Silakan login ulang.");
        onLogout && onLogout();
      } else {
        alert(
          "Gagal memuat EQ profiles. Pastikan backend jalan & token valid."
        );
      }
    }
  }, [token, checkToken, onLogout]);

  // hapus EQ (hanya untuk admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus EQ ini?")) return;
    if (!checkToken()) return;

    try {
      await axios.delete(`http://localhost:3001/api/eq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfiles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal hapus EQ");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div>
      <h2>Daftar EQ Profiles</h2>

      {profiles.length === 0 ? (
        <p>Tidak ada data EQ</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>IEM</th>
              <th>Genre</th>
              <th>EQ Values</th>
              <th>IEM Description</th> {/* kolom tambahan */}
              {role === "admin" && <th>Aksi</th>}
              <th>Chart</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.genre || "-"}</td>
                <td>
                  <pre>
                    {frequencyOrder.map((freq) => (
                      <div key={freq}>
                        {freq}: {p.eqValues[freq] ?? "-"}
                      </div>
                    ))}
                  </pre>
                </td>
                <td>{describeIEM(p.eqValues)}</td> {/* deskripsi IEM */}
                {role === "admin" && (
                  <td>
                    <button onClick={() => onEdit(p)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(p.id)}>Hapus</button>
                  </td>
                )}
                <td>
                  <button onClick={() => setSelectedChart(p.eqValues)}>
                    Lihat Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedChart && (
        <div style={{ marginTop: 30 }}>
          <EQChart eqValues={selectedChart} />
          <button onClick={() => setSelectedChart(null)}>Tutup</button>
        </div>
      )}
    </div>
  );
};

export default EQList;
