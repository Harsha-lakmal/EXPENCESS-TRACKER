import React, { useState } from 'react';
import axios from 'axios';

function AddExpense() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);

  const API_URL = 'http://13.200.40.97:3000';

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user_id', 1);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('image', image);

    try {
      await axios.post(`${API_URL}/api/expenses`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
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
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Expense</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <label style={styles.label}>Date:</label>
        <input 
          type="date" 
          required 
          value={date}
          onChange={(e) => setDate(e.target.value)} 
          style={styles.input} 
        />

        <label style={styles.label}>Description:</label>
        <textarea 
          placeholder="Enter description" 
          required 
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
          style={styles.input} 
        />

        <label style={styles.label}>Amount (Rs):</label>
        <input 
          type="number" 
          required 
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
          style={styles.input} 
        />

        <label style={styles.label}>Receipt Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
          style={styles.input} 
        />

        <button type="submit" style={styles.button}>Save Expense</button>
      </form>
    </div>
  );
}

const styles = {
  container: { 
    maxWidth: '500px', 
    margin: '40px auto', 
    padding: '25px', 
    border: '1px solid #eee', 
    borderRadius: '12px', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  title: { 
    textAlign: 'center', 
    color: '#333',
    marginBottom: '20px'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column' 
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555'
  },
  input: { 
    padding: '12px', 
    margin: '0 0 20px 0', 
    borderRadius: '6px', 
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  button: { 
    padding: '14px', 
    background: '#28a745', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.3s'
  }
};

export default AddExpense;