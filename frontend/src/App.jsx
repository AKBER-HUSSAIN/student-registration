import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";


  const [form, setForm] = useState({
    name: '', rollNo: '', gender: '', department: '', section: '', skills: []
  });
  const [message, setMessage] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Fetch students error', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkills = (e) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      skills: checked ? [...prev.skills, value] : prev.skills.filter(s => s !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMessage('Student saved ✅');
      setForm({ name: '', rollNo: '', gender: '', department: '', section: '', skills: [] });
      fetchStudents();
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + err.message);
    }
  };

  const skillsList = ['C', 'C++', 'Java', 'JS', 'Ruby'];

  return (
    <div className="app">
      <div className="form-container">
        <h2>Student Registration</h2>
        {message && <div className="msg">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Roll No</label>
          <input name="rollNo" value={form.rollNo} onChange={handleChange} required />

          <label>Gender</label>
          <div className="row">
            <label><input type="radio" name="gender" value="Male" checked={form.gender==='Male'} onChange={handleChange}/> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={form.gender==='Female'} onChange={handleChange}/> Female</label>
          </div>

          <label>Department</label>
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option>IT</option>
            <option>CSE</option>
            <option>AIDS</option>
            <option>CET</option>
          </select>

          <label>Section</label>
          <select name="section" value={form.section} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="1">1</option><option value="2">2</option><option value="3">3</option>
          </select>

          <label>Skills</label>
          <div className="checkbox-group">
            {skillsList.map(s => (
              <label key={s}>
                <input type="checkbox" value={s} checked={form.skills.includes(s)} onChange={handleSkills} /> {s}
              </label>
            ))}
          </div>

          <button className="btn" type="submit">Save</button>
        </form>
      </div>

      <div className="list-container">
        <h3>Registered Students</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Roll</th><th>Gender</th><th>Dept</th><th>Section</th><th>Skills</th></tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan="6">No students yet</td></tr>
            )}
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>{s.gender}</td>
                <td>{s.department}</td>
                <td>{s.section}</td>
                <td>{(s.skills || []).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
