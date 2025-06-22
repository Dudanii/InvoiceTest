import { useEffect, useState } from "react";
import http from "../api/http";
import useAuth from "../auth/useAuth";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";

export default function Users() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    role: "User",
    user_id_code: ""
  });
  const [err, setErr] = useState("");

  /* ---------- data helpers ---------- */
  const load = async () => {
    try {
      const { data } = await http.get("/users/");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleDelete = async (id, email) => {
    const confirmed = window.confirm(
      `Delete user "${email}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await http.delete(`/users/${id}`);
      load();               // refresh list
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  /* ---------- lifecycle ---------- */
  useEffect(() => { load(); }, []);

  /* ---------- create ---------- */
  const handleCreate = async e => {
    e.preventDefault();
    try {
      await http.post("/users/", form);
      setForm({ user_name: "", email: "", password: "", role: "User", user_id_code: "" });
      setErr("");
      load();
    } catch (err) {
      setErr("Failed to create user");
    }
  };

  /* ---------- filters ---------- */
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.user_name.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  );

  const canCreate = role === "ADMIN" || role === "UNIT_MANAGER";
  const canDelete = role === "ADMIN";   // adjust as needed

  /* ---------- render ---------- */
  return (
    <div className="users-container">
      <h2 className="users-title">Users</h2>

      <div className="users-header-buttons">
        <button onClick={() => navigate("/invoices")} className="button blue">Go to Invoices</button>
        <button onClick={() => { logout(); navigate("/login"); }} className="button blue">LogOut</button>
      </div>

      {canCreate && (
        <form onSubmit={handleCreate} className="create-form">
          {err && <p className="error-message">{err}</p>}
          <input placeholder="Name" value={form.user_name} onChange={e => setForm({ ...form, user_name: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <input placeholder="User ID Code" value={form.user_id_code} onChange={e => setForm({ ...form, user_id_code: e.target.value })} required />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option>User</option><option>Unit Manager</option><option>Admin</option>
          </select>
          <button type="submit" className="button green">Create User</button>
        </form>
      )}

      <h2>List and Search Users</h2>
      <input
        className="search-input"
        placeholder="Search by name, email, or role"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th>
            <th>User ID Code</th><th>Created By</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan={6} className="no-data">No users found.</td></tr>
          ) : (
            filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.user_name}</td>
                <td>{u.email}</td>

                <td>
                  {role === "ADMIN" ? (
                    <select
                      value={u.role || ""}
                      onChange={async e => {
                        try { await http.patch(`/users/${u.id}`, { role: e.target.value }); load(); }
                        catch (err) { console.error("Failed to update role", err); alert("Failed to update role"); }
                      }}
                    >
                      <option value="" disabled>Select</option>
                      <option value="USER">User</option>
                      <option value="UNIT_MANAGER">Unit Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>

                <td>{u.user_id_code}</td>
                <td>{u.created_by_id || "-"}</td>

                <td>
                  {canDelete && (
                    <button
                      className="button red"
                      onClick={() => handleDelete(u.id, u.email)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
