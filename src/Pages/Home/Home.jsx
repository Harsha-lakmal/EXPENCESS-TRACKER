import React, { useState } from 'react';
import axios from 'axios';

function AddExpense() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);

  // Backend එකේ IP එක මෙතනට දාන්න
  const API_URL = 'http://ඔයාගේ-AWS-IP-එක:3000';

  const handleUpload = async (e) => {
    e.preventDefault();

    // Multipart form data යවන්න FormData object එකක් අවශ්‍යයි
    const formData = new FormData();
    formData.append('user_id', 1); // දැනට 1 කියලා දෙමු
    formData.append('date', date);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('image', image); // පින්තූරය

    try {
      await axios.post(`${API_URL}/api/expenses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("වියදම සාර්ථකව ඇතුළත් කළා! ✅");
      // Form එක reset කරන්න
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Error: දත්ත ඇතුළත් කිරීම අසාර්ථකයි!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center' }}>Add Your Expense 💸</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <label>දිනය (Date):</label>
        <input type="date" required onChange={(e) => setDate(e.target.value)} style={styles.input} />

        <label>විස්තරය (Description):</label>
        <textarea 
          placeholder="මොකක් සඳහාද වියදම් වුණේ?" 
          required 
          onChange={(e) => setDescription(e.target.value)} 
          style={styles.input} 
        />

        <label>මුදල (Amount - Rs):</label>
        <input type="number" required placeholder="0.00" onChange={(e) => setAmount(e.target.value)} style={styles.input} />

        <label>බිල්පතේ පින්තූරය (Bill Image):</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />

        <button type="submit" style={styles.button}>Save Expense</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AddExpense;