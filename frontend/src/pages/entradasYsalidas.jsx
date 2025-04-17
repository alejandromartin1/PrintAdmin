import { useState } from "react";
import { Card, CardContent, Button, TextField } from "@mui/material";
import "../styles/entradasysalidas.css";

export default function EntriesAndExpenses() {
  const [entries, setEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newEntry, setNewEntry] = useState({ description: "", quantity: "", cost: "" });
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", reason: "" });

  const handleAddEntry = () => {
    if (!newEntry.description || !newEntry.quantity || !newEntry.cost) {
      alert("Por favor, completa todos los campos de entrada.");
      return;
    }

    setEntries([
      ...entries,
      { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString(), quantity: parseFloat(newEntry.quantity), cost: parseFloat(newEntry.cost) }
    ]);
    setNewEntry({ description: "", quantity: "", cost: "" });
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.reason) {
      alert("Por favor, completa todos los campos de salida.");
      return;
    }

    setExpenses([
      ...expenses,
      { ...newExpense, id: Date.now(), date: new Date().toLocaleDateString(), amount: parseFloat(newExpense.amount) }
    ]);
    setNewExpense({ description: "", amount: "", reason: "" });
  };

  return (
    <div className="container">
      {/* Sección de Entradas */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <h2>Entradas (Trabajos realizados)</h2>
          <div className="form-group">
            <TextField label="Descripción" variant="outlined" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} />
            <TextField label="Cantidad" type="number" variant="outlined" value={newEntry.quantity} onChange={(e) => setNewEntry({ ...newEntry, quantity: e.target.value })} />
            <TextField label="Costo" type="number" variant="outlined" value={newEntry.cost} onChange={(e) => setNewEntry({ ...newEntry, cost: e.target.value })} />
            <Button variant="contained" color="primary" onClick={handleAddEntry}>Agregar</Button>
          </div>
          <ul className="list">
            {entries.map((entry) => (
              <li key={entry.id} className="list-item">{entry.date} - {entry.description} - {entry.quantity} - ${entry.cost.toFixed(2)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Sección de Salidas */}
      <Card>
        <CardContent>
          <h2>Salidas (Gastos del día)</h2>
          <div className="form-group">
            <TextField label="Descripción" variant="outlined" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
            <TextField label="Monto" type="number" variant="outlined" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
            <TextField label="Motivo" variant="outlined" value={newExpense.reason} onChange={(e) => setNewExpense({ ...newExpense, reason: e.target.value })} />
            <Button variant="contained" color="secondary" onClick={handleAddExpense}>Agregar</Button>
          </div>
          <ul className="list">
            {expenses.map((expense) => (
              <li key={expense.id} className="list-item">{expense.date} - {expense.description} - ${expense.amount.toFixed(2)} - {expense.reason}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
