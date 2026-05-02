import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data))
  }, [])

  async function createProject(e) {
    e.preventDefault()
    const res = await api.post('/projects', { name, description: desc })
    setProjects([...projects, res.data])
    setName('')
    setDesc('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>สวัสดี, {user.username} 👋</h2>
        <div style={styles.headerActions}>
          {user.role === 'Admin' && (
            <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
              👑 Admin Panel
            </button>
          )}
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>สร้าง Project ใหม่</h3>
        <form onSubmit={createProject} style={styles.form}>
          <input style={styles.input} placeholder="ชื่อ Project" value={name} onChange={(e) => setName(e.target.value)} required />
          <input style={styles.input} placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button style={styles.button} type="submit">สร้าง</button>
        </form>
      </div>

      <h3>Projects ทั้งหมด</h3>
      <div style={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} style={styles.projectCard} onClick={() => navigate(`/projects/${p.id}`)}>
            <h4>{p.name}</h4>
            <p style={styles.desc}>{p.description || 'ไม่มี description'}</p>
            <small style={styles.owner}>โดย {p.ownerUsername}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  headerActions: { display: 'flex', gap: '10px' },
  adminBtn: { padding: '8px 16px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' },
  form: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', flex: 1, minWidth: '150px' },
  button: { padding: '8px 20px', background: '#1677ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' },
  projectCard: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' },
  desc: { color: '#666', fontSize: '14px', margin: '8px 0' },
  owner: { color: '#999', fontSize: '12px' },
}