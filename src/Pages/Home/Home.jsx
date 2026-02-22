import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Backend එකේ තියෙන IP එක මෙතනට දාන්න
  const API_URL = 'http://ඔයාගේ-AWS-IP-එක:3000';

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // අපි Backend එකේ හැදුවේ /api/expenses කියන route එක
        const response = await axios.get(`${API_URL}/api/expenses`); 
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Data fetch error:", error);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading Expenses...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>My Expense Tracker</h2>
      
      <div style={styles.grid}>
        {expenses.length > 0 ? (
          expenses.map(exp => (
            <div key={exp.expense_id} style={styles.card}>
              {/* ෆොටෝ එකක් තිබේ නම් පමණක් පෙන්වන්න */}
              {exp.image_path && (
                <img 
                  src={`${API_URL}/uploads/${exp.image_path}`} 
                  alt="Receipt" 
                  style={styles.image} 
                />
              )}
              <div style={styles.details}>
                <p><strong>Date:</strong> {new Date(exp.date).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> Rs. {exp.amount}</p>
                <p><strong>Note:</strong> {exp.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>No expenses found.</p>
        )}
      </div>
    </div>
  );
}

// පොඩි CSS ස්ටයිල් ටිකක් ලස්සනට පේන්න
const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  details: {
    padding: '15px'
  }
};

export default ExpenseList;