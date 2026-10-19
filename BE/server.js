const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Database Table Creation with Priority
pool.query(`
  CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    group_name VARCHAR(100) DEFAULT 'General',
    priority VARCHAR(50) DEFAULT 'Normal Priority',
    start_date TEXT,
    end_date TEXT
  )
`).catch(err => console.error("Table creation error:", err));

// Get All Notes (with optional group & priority filtering)
app.get('/api/notes', async (req, res) => {
  try {
    const { group, priority } = req.query;
    let query = 'SELECT * FROM notes ORDER BY id DESC';
    let values = [];

    if (group && group !== 'All' && priority && priority !== 'All') {
      query = 'SELECT * FROM notes WHERE group_name = $1 AND priority = $2 ORDER BY id DESC';
      values = [group, priority];
    } else if (group && group !== 'All') {
      query = 'SELECT * FROM notes WHERE group_name = $1 ORDER BY id DESC';
      values = [group];
    } else if (priority && priority !== 'All') {
      query = 'SELECT * FROM notes WHERE priority = $1 ORDER BY id DESC';
      values = [priority];
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, group_name, priority, start_date, end_date } = req.body;
    const result = await pool.query(
      'INSERT INTO notes (title, content, group_name, priority, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, content, group_name || 'General', priority || 'Normal Priority', start_date, end_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, group_name, priority, start_date, end_date } = req.body;
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, group_name = $3, priority = $4, start_date = $5, end_date = $6 WHERE id = $7 RETURNING *',
      [title, content, group_name, priority, start_date, end_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));