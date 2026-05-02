import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data))
  }, [])

  async function updateRole(userId, role) {
    await api.patch(`/admin/users/${userId}/role`, { role })
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)))
  }

  async function deleteUser(userId) {
    if (!confirm('ยืนยันลบ User นี้?')) return
    await api.delete(`/admin/users/${userId}`)
    setUsers(users.filter((u) => u.id !== userId))
  }

  async function revokeUser(userId) {
    await api.post(`/admin/users/${userId}/revoke`)
    alert('Revoke tokens สำเร็จ')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>👑 Admin Panel — จัดการ User</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← กลับ</button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>สมัครเมื่อ</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: user.role === 'Admin' ? '#faad14' : '#1677ff' }}>
                    {user.role}
                  </span>
                </td>
                <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString('th-TH')}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {user.role === 'Member' ? (
                      <button style={styles.promoteBtn} onClick={() => updateRole(user.id, 'Admin')}>
                        ⬆ Admin
                      </button>
                    ) : (
                      <button style={styles.demoteBtn} onClick={() => updateRole(user.id, 'Member')}>
                        ⬇ Member
                      </button>
                    )}
                    <button style={styles.revokeBtn} onClick={() => revokeUser(user.id)}>
                      🔒 Revoke
                    </button>
                    <button style={styles.deleteBtn} onClick={() => deleteUser(user.id)}>
                      🗑 ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  card: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f5f5f5' },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px' },
  badge: { color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' },
  actions: { display: 'flex', gap: '8px' },
  promoteBtn: { padding: '4px 10px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  demoteBtn: { padding: '4px 10px', background: '#888', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  revokeBtn: { padding: '4px 10px', background: '#ff7a00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
}