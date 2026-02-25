import React, { useState } from 'react';
import axios from 'axios';
import '../Home/Home.css';  

function AddExpense() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);

 const API_URL = 'http://localhost:3000';

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('date', date);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('image', image);

    try {
      //await axios.post(`${API_URL}/api/expenses`, formData);
      await axios.post(`${API_URL}/api/expenses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Expense added successfully!");
      setDate('');
      setDescription('');
      setAmount('');
      setImage(null);
      e.target.reset();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error: Failed to add data!");
    }
  };

  return (
    <div className="add-expense-container">
      <h2 className="add-expense-title">Add New Expense</h2>
      <form onSubmit={handleUpload} className="add-expense-form">
        <label className="add-expense-label">Date:</label>
        <input 
          type="date" 
          required 
          value={date}
          onChange={(e) => setDate(e.target.value)} 
          className="add-expense-input" 
        />

        <label className="add-expense-label">Description:</label>
        <textarea 
          placeholder="Enter description" 
          required 
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
          className="add-expense-input" 
        />

        <label className="add-expense-label">Amount (Rs):</label>
        <input 
          type="number" 
          required 
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
          className="add-expense-input" 
        />

        <label className="add-expense-label">Receipt Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
          className="add-expense-input" 
        />

        <button type="submit" className="add-expense-button">Save Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;