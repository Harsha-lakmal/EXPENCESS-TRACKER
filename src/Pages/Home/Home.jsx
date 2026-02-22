import React, { useState, useEffect } from 'react';
import axios from 'axios';
 

function UserList() {
  const [users, setUsers] = useState([]); // Data store karanna
  const [loading, setLoading] = useState(true); // Load  wenawada balanna

  useEffect(() => {
    // Backend  eken data ganna funtion ekak
    const fetchUsers = async () => {
      try {
       
        const response = await axios.get('http://localhost:3000/add-user'); 
        setUsers(response.data); // labna data state ekata da ganna 
        setLoading(false);
      } catch (error) {
        console.error("Data fesh erros :", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // [] nisa eka parak run wei

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.user_id}>
            {user.name} - {user.mail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;