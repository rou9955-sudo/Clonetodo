import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupName, setGroupName] = useState('Work');
  const [priority, setPriority] = useState('Normal Priority');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editId, setEditId] = useState(null);
  
  // State to control modal form visibility
  const [showForm, setShowForm] = useState(false);

  const [filterGroup, setFilterGroup] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notes`;

  useEffect(() => {
    fetchNotes();
  }, [filterGroup, filterPriority]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}?group=${filterGroup}&priority=${filterPriority}`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { 
      title, 
      content, 
      group_name: groupName, 
      priority, 
      start_date: startDate, 
      end_date: endDate 
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, noteData);
        setEditId(null);
      } else {
        await axios.post(API_URL, noteData);
      }
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setGroupName('Work');
    setPriority('Normal Priority');
    setStartDate('');
    setEndDate('');
    setEditId(null);
    setShowForm(false); // Form hide hone ke liye
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setGroupName(note.group_name);
    setPriority(note.priority || 'Normal Priority');
    setStartDate(note.start_date ? note.start_date.split('T')[0] : '');
    setEndDate(note.end_date ? note.end_date.split('T')[0] : '');
    setShowForm(true); // Edit karne par form open hoga
  };

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap sach mein is note ko delete karna chahte hain?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  // Priority color styling helper
  const getPriorityColor = (p) => {
    switch(p) {
      case 'Top Priority': return '#ef4444'; // Red
      case 'Normal Priority': return '#f59e0b'; // Yellow/Orange
      case 'Low Priority': return '#3b82f6'; // Blue
      default: return '#22c55e';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      color: '#ffffff', 
      padding: '20px', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <h2 style={{ textAlign: 'center', color: '#22c55e', marginBottom: '25px', letterSpacing: '1px' }}>
          📝 Todo & Notes Manager
        </h2>

        {/* Filter Section - Top Par Clear Look */}
        <div style={{ marginBottom: '20px', background: '#121212', padding: '15px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
            <label style={{ fontWeight: 'bold', color: '#22c55e', whiteSpace: 'nowrap' }}>Group:</label>
            <select 
              value={filterGroup} 
              onChange={(e) => setFilterGroup(e.target.value)} 
              style={{ padding: '6px 10px', background: '#000', color: '#fff', border: '1px solid #22c55e', borderRadius: '5px', width: '100%' }}
            >
              <option value="All">All Groups</option>
              <option value="FirstInvoice">FirstInvoice</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Bpsc">Bpsc</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
            <label style={{ fontWeight: 'bold', color: '#22c55e', whiteSpace: 'nowrap' }}>Priority:</label>
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)} 
              style={{ padding: '6px 10px', background: '#000', color: '#fff', border: '1px solid #22c55e', borderRadius: '5px', width: '100%' }}
            >
              <option value="All">All Priorities</option>
              <option value="Top Priority">Top Priority</option>
              <option value="Normal Priority">Normal Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>

        </div>

        {/* Notes Display Section */}
        <div>
          <h3 style={{ borderBottom: '2px solid #22c55e', paddingBottom: '8px', marginBottom: '15px' }}>📋 Notes List</h3>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No notes found.</p>
          ) : (
            notes.map(note => (
              <div key={note.id} style={{ 
                border: '1px solid #333', 
                background: '#121212', 
                padding: '15px', 
                margin: '15px 0', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>{note.title}</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#22c55e', 
                      color: '#000', 
                      fontWeight: 'bold',
                      padding: '3px 8px', 
                      borderRadius: '4px' 
                    }}>
                      {note.group_name}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      background: getPriorityColor(note.priority), 
                      color: '#fff', 
                      fontWeight: 'bold',
                      padding: '3px 8px', 
                      borderRadius: '4px' 
                    }}>
                      {note.priority || 'Normal Priority'}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: '#cccccc', margin: '10px 0', lineHeight: '1.4' }}>{note.content}</p>
                
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                  📅 <b>{note.start_date ? note.start_date.split('T')[0] : 'N/A'}</b> to <b>{note.end_date ? note.end_date.split('T')[0] : 'N/A'}</b>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(note)} 
                    style={{ padding: '6px 14px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)} 
                    style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* RIGHT BOTTOM CORNER FLOATING + BUTTON */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#22c55e',
          color: '#000000',
          border: 'none',
          borderRadius: '50px',
          padding: '14px 22px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000
        }}
      >
        <span style={{ fontSize: '22px', lineHeight: '1' }}>+</span> Add Note
      </button>

      {/* POPUP MODAL FORM FOR ADD / EDIT NOTE */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001,
          padding: '15px'
        }}>
          <form onSubmit={handleSubmit} style={{ 
            background: '#121212', 
            border: '2px solid #22c55e', 
            padding: '25px', 
            borderRadius: '12px', 
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={resetForm}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                color: '#888',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>

            <h3 style={{ color: '#ffffff', marginTop: 0, marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              {editId ? '✏️ Edit Note' : '➕ Add New Note'}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontWeight: 'bold' }}>Title</label>
              <input 
                type="text" 
                placeholder="Enter note title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontWeight: 'bold' }}>Content</label>
              <textarea 
                placeholder="Write your note content here..." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px', height: '90px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontWeight: 'bold' }}>Group</label>
                <select 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px' }}
                >
                  <option value="FirstInvoice">FirstInvoice</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Bpsc">Bpsc</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontWeight: 'bold' }}>Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px' }}
                >
                  <option value="Top Priority">Top Priority</option>
                  <option value="Normal Priority">Normal Priority</option>
                  <option value="Low Priority">Low Priority</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontSize: '14px' }}>Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  style={{ width: '100%', padding: '8px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px', boxSizing: 'border-box' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#22c55e', fontSize: '14px' }}>End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  style={{ width: '100%', padding: '8px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: '#22c55e', 
                color: '#000', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {editId ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

export default App;