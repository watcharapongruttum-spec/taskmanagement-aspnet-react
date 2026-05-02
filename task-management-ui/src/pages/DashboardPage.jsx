import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as signalR from '@microsoft/signalr'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [editingProject, setEditingProject] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data))

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SIGNALR_URL || 'http://localhost:5280'}/hubs/tasks`, {
        accessTokenFactory: () => user.accessToken,
      })
      .withAutomaticReconnect()
      .build()

    connection.on('ProjectCreated', (project) => {
      setProjects(prev => {
        if (prev.find(p => p.id === project.id)) return prev
        return [...prev, project]
      })
    })

    connection.start()
    return () => connection.stop()
  }, [])

  async function createProject(e) {
    e.preventDefault()
    const res = await api.post('/projects', { name, description: desc })
    setProjects([...projects, res.data])
    setName('')
    setDesc('')
  }

  async function deleteProject(e, projectId) {
    e.stopPropagation()
    if (!confirm('ยืนยันลบ Project นี้?')) return
    await api.delete(`/projects/${projectId}`)
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  async function updateProject(e) {
    e.preventDefault()
    await api.put(`/projects/${editingProject.id}`, {
      name: editingProject.name,
      description: editingProject.description,
    })
    setProjects(prev => prev.map(p =>
      p.id === editingProject.id ? { ...p, name: editingProject.name, description: editingProject.description } : p
    ))
    setEditingProject(null)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>สวัสดี, {user.username} 👋</h2>
        <div style={styles.headerActions}>
          <button style={styles.profileBtn} onClick={() => navigate('/profile')}>👤 Profile</button>
          {user.role === 'Admin' && (
            <button style={styles.adminBtn} onClick={() => navigate('/admin')}>👑 Admin Panel</button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0 }}>{p.name}</h4>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingProject({ id: p.id, name: p.name, description: p.description || '' }) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                <button
                  onClick={(e) => deleteProject(e, p.id)}
                  style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            </div>
            <p style={styles.desc}>{p.description || 'ไม่มี description'}</p>
            <small style={styles.owner}>โดย {p.ownerUsername}</small>
          </div>
        ))}
      </div>

      {editingProject && (
        <div style={styles.overlay} onClick={() => setEditingProject(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>แก้ไข Project</h3>
            <form onSubmit={updateProject}>
              <input
                style={{ ...styles.input, width: '100%', marginBottom: 10, boxSizing: 'border-box' }}
                placeholder="ชื่อ Project"
                value={editingProject.name}
                onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                required
              />
              <input
                style={{ ...styles.input, width: '100%', marginBottom: 16, boxSizing: 'border-box' }}
                placeholder="Description"
                value={editingProject.description}
                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingProject(null)}
                  style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc' }}>ยกเลิก</button>
                <button type="submit"
                  style={{ padding: '8px 16px', background: '#1677ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  headerActions: { display: 'flex', gap: '10px' },
  profileBtn: { padding: '8px 16px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' },
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
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: 24, borderRadius: 8, width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
}