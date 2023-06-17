import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [selectUser, setSelectUser] = useState(null);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost/api-myapp/users.php')
      setUsers(response.data);
    } catch (error) {
      console.log(error)
      alert('Terjadi kesalahan dalam mengakses URL lokal. Mohon pastikan XAMPP telah dijalankan.');
    }
  }

  const addData = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost/api-myapp/users.php', {
        nama: nama,
        username: username,
        email: email
      })
      const newData = response.data;
      setUsers(prevUser => [...prevUser, newData]);
      setNama('')
      setUsername('')
      setEmail('')

      alert("Data berhasil ditambahkan!")
    } catch (error) {
      console.log(error)
    }
  }

  const updateData = async (id) => {
    try {
      await axios.put(`http://localhost/api-myapp/users.php?id=${id}`, {
        nama: nama,
        username: username,
        email: email
      })

      fetchData()
      setSelectUser(null)
      setNama('')
      setUsername('')
      setEmail('')

      alert("Data berhasil diupdate!")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectUser = (user) => {
    setSelectUser(user)
    setNama(user ? user.nama : '')
    setUsername(user ? user.username : '')
    setEmail(user ? user.email : '')
  }
  const handleDelete = (id) => {
    const confirm = window.confirm('yakin ingin hapus data ini?');

    if (confirm) {
      confirmDelete(id)
    }
  }

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost/api-myapp/users.php?id=${id}`)
      fetchData();
      alert("Data berhasil didelete!")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        {selectUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
            <h3>Update Data</h3>
            <label>Nama</label>
            <input type='text' value={nama} onChange={(e) => setNama(e.target.value)} />

            <label>Username</label>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Email</label>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ marginTop: '10px', width: '140px' }} onClick={() => updateData(selectUser.id)}>Simpan Perubahan</button>
              <button style={{ marginTop: '10px', width: '140px' }} onClick={() => handleSelectUser(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <form onSubmit={addData} style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
            <h3>Tambah Data</h3>
            <label>Nama</label>
            <input type='text' value={nama} onChange={(e) => setNama(e.target.value)} />

            <label>Username</label>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Email</label>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='submit' style={{ marginTop: '10px', width: '140px' }}>Simpan</button>
          </form>
        )}
        <table border={1}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, nomr) => (
              <tr key={user.id}>
                <td>{nomr + 1}</td>
                <td>{user.nama}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleSelectUser(user)}>Update</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div >
  );
}

export default App;