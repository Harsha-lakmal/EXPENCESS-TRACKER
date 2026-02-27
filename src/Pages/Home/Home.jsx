import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";

const API_URL = "http://localhost:3000";

const expenseAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/api/expenses/expensess`);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return await res.json();
  },
  create: async (formData) => {
    const res = await fetch(`${API_URL}/api/expenses/expenses`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return await res.json();
  },
  update: async (id, formData) => {
    const res = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error(`PUT ${res.status}`);
    return await res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE ${res.status}`);
    return await res.json();
  },
};

export default function AddExpense() {
  const [date,        setDate]        = useState("");
  const [description, setDescription] = useState("");
  const [amount,      setAmount]      = useState("");
  const [image,       setImage]       = useState(null);
  const [selectedId,  setSelectedId]  = useState(null);
  const [manualId,    setManualId]    = useState("");
  const [expenses,    setExpenses]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [toast,       setToast]       = useState(null); // { msg, type }
  const [fetchKey,    setFetchKey]    = useState(0);    // increment → force reload

  // ── force table reload by incrementing fetchKey ──
  const triggerReload = () => setFetchKey((k) => k + 1);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── fetch all expenses ──
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseAPI.getAll();
      const list = Array.isArray(data) ? data : data.data || [];
      setExpenses(list);
    } catch (err) {
      console.error("loadAll:", err);
      showToast("Failed to load expenses! " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // re-fetch whenever fetchKey changes
  useEffect(() => {
    loadAll();
  }, [fetchKey, loadAll]);

  const resetForm = () => {
    setDate(""); setDescription(""); setAmount("");
    setImage(null); setSelectedId(null); setManualId("");
    const f = document.getElementById("exp-file");
    if (f) f.value = "";
  };

  const handleRowClick = (ex) => {
    const id = ex._id || ex.id;
    setSelectedId(id);
    setManualId(id);
    setDate(ex.date ? ex.date.slice(0, 10) : "");
    setDescription(ex.description || "");
    setAmount(ex.amount || "");
    setImage(null);
  };

  const getActiveId = () => manualId.trim() || selectedId;

  // ── SAVE ──
  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("date", date);
    fd.append("description", description);
    fd.append("amount", amount);
    if (image) fd.append("image", image);
    try {
      await expenseAPI.create(fd);
      resetForm();
      showToast("✅ Expense added!");
      triggerReload();          // force re-fetch
    } catch (err) {
      console.error("Save:", err);
      showToast("❌ Failed to add: " + err.message, "error");
    }
  };

  // ── UPDATE ──
  const handleUpdate = async () => {
    const id = getActiveId();
    if (!id) { showToast("⚠️ Select a row or enter an ID first!", "error"); return; }
    const fd = new FormData();
    fd.append("date", date);
    fd.append("description", description);
    fd.append("amount", amount);
    if (image) fd.append("image", image);
    try {
      await expenseAPI.update(id, fd);
      resetForm();
      showToast("✅ Expense updated!");
      triggerReload();          // force re-fetch
    } catch (err) {
      console.error("Update:", err);
      showToast("❌ Failed to update: " + err.message, "error");
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    const id = getActiveId();
    if (!id) { showToast("⚠️ Select a row or enter an ID first!", "error"); return; }
    if (!window.confirm(`Delete expense?\nID: ${id}`)) return;
    try {
      await expenseAPI.delete(id);
      resetForm();
      showToast("✅ Expense deleted!");
      triggerReload();          // force re-fetch
    } catch (err) {
      console.error("Delete:", err);
      showToast("❌ Failed to delete: " + err.message, "error");
    }
  };

  const total = expenses.reduce((s, ex) => s + Number(ex.amount || 0), 0);
  const activeId = getActiveId();

  return (
    <div className="expense-page">

      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "12px 20px", borderRadius: 8, fontWeight: 600,
          fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          background: toast.type === "error" ? "#fee2e2" : "#dcfce7",
          color: toast.type === "error" ? "#b91c1c" : "#15803d",
          border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#86efac"}`,
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── FORM ── */}
      <div className="expense-form-box">
        <h2 className="expense-form-title">Add New Expense</h2>

        {/* ID field */}
        <label className="expense-label">Expense ID (Update / Delete):</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          <input
            type="text"
            placeholder="Type ID  OR  click a table row ↓"
            value={manualId}
            onChange={(e) => { setManualId(e.target.value); setSelectedId(null); }}
            className="expense-input"
            style={{ flex: 1 }}
          />
          {activeId && (
            <button
              type="button" onClick={resetForm}
              style={{
                padding: "0 10px", border: "1px solid #ccc", borderRadius: 6,
                background: "#f0f0f0", cursor: "pointer", fontWeight: 700,
              }}
            >✕</button>
          )}
        </div>

        {activeId && (
          <div className="expense-selected-notice">
            ✅ ID: <strong style={{ wordBreak: "break-all", fontSize: "0.72rem" }}>{activeId}</strong>
          </div>
        )}

        {/* Save form */}
        <form onSubmit={handleSave} className="expense-form">
          <label className="expense-label">Date:</label>
          <input type="date" required value={date}
            onChange={(e) => setDate(e.target.value)} className="expense-input" />

          <label className="expense-label">Description:</label>
          <textarea placeholder="Enter description" required value={description}
            onChange={(e) => setDescription(e.target.value)} className="expense-textarea" />

          <label className="expense-label">Amount (Rs):</label>
          <input type="number" required placeholder="0.00" value={amount}
            onChange={(e) => setAmount(e.target.value)} className="expense-input" />

          <label className="expense-label">Receipt Image:</label>
          <input id="exp-file" type="file" accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} className="expense-input" />

          <button type="submit" className="expense-btn expense-btn-save">Save Expense</button>
        </form>

        <button type="button" onClick={handleUpdate} className="expense-btn expense-btn-update">
          Update Expense
        </button>
        <button type="button" onClick={handleDelete} className="expense-btn expense-btn-delete">
          Delete Expense
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="expense-table-box">
        <div className="expense-table-header">
          <h2 className="expense-form-title" style={{ margin: 0 }}>All Expenses</h2>
          <button onClick={triggerReload} className="expense-refresh-btn">↻ Refresh</button>
        </div>

        {loading ? (
          <p className="expense-empty">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="expense-empty">No expenses found.</p>
        ) : (
          <>
            <div className="expense-table-scroll">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount (Rs)</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((ex, idx) => {
                    const id = ex._id || ex.id;
                    return (
                      <tr
                        key={id}
                        onClick={() => handleRowClick(ex)}
                        className={id === activeId ? "expense-row-selected" : ""}
                        title="Click to select"
                        style={{ cursor: "pointer" }}
                      >
                        <td>{idx + 1}</td>
                        <td style={{ fontSize: "0.7rem", color: "#9ca3af", maxWidth: 100,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          title={id}>{id}</td>
                        <td>{ex.date ? ex.date.slice(0, 10) : "—"}</td>
                        <td className="expense-td-desc">{ex.description}</td>
                        <td className="expense-td-amount">{Number(ex.amount).toLocaleString()}</td>
                        <td>
                          {ex.imageUrl
                            ? <a href={ex.imageUrl} target="_blank" rel="noreferrer"
                                className="expense-receipt-link"
                                onClick={(e) => e.stopPropagation()}>View</a>
                            : <span className="expense-no-receipt">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="expense-table-total">Total: Rs {total.toLocaleString()}</div>
          </>
        )}
      </div>
    </div>
  );
}