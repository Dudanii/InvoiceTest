import { useEffect, useState } from "react";
import http from "../api/http";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Invoices.css";

export default function Invoices() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    invoice_number: "",
    invoice_date: "",
    invoice_amount: ""
  });

  const handleLogout = () => {
    console.log("Logout initiated");
    logout(); // You might need to import this function
    navigate("/login");
    console.log("Should be on login page now");
  };

  const load = async () => {
    try {
      const { data } = await http.get("/invoices/");
      console.log("Received data:", data);
      setRows(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    }
  };

  const create = async e => {
    e.preventDefault();
    await http.post("/invoices/", {
      invoice_number: form.invoice_number,
      invoice_date: form.invoice_date,
      invoice_amount: parseFloat(form.invoice_amount)
    });
    setForm({ invoice_number: "", invoice_date: "", invoice_amount: "" });
    load();
  };

  const del = async inv => {
    await http.delete("/invoices/", { data: [inv] });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="invoice-container">
      <h2 className="invoice-title">Invoices</h2>
      <div className="button-group">
        <button onClick={() => navigate("/users")} className="button blue">
          Go to Users
        </button>
        <button onClick={handleLogout} className="button blue">
          LogOut
        </button>
      </div>

      <form onSubmit={create} className="invoice-form">
        <input
          placeholder="INV-001"
          value={form.invoice_number}
          onChange={e => setForm({ ...form, invoice_number: e.target.value })}
        />
        <input
          type="date"
          value={form.invoice_date}
          onChange={e => setForm({ ...form, invoice_date: e.target.value })}
        />
        <input
          placeholder="Amount"
          value={form.invoice_amount}
          onChange={e => setForm({ ...form, invoice_amount: e.target.value })}
        />
        <button className="button green">Add</button>
      </form>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.invoice_number}</td>
              <td>{r.invoice_date}</td>
              <td>{r.invoice_amount}</td>
              <td>
                <button
                  onClick={() => del(r.invoice_number)}
                  className="delete-button"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
