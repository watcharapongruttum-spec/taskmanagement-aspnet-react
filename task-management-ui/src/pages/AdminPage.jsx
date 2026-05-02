import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) // { id, username, newPassword }
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

  async function saveEditUser(e) {
    e.preventDefault()
    await api.put('/auth/profile-admin', {
      targetUserId: editingUser.id,
      username: editingUser.username,
      newPassword: editingUser.newPassword || null,
    })
    setUsers(users.map((u) => u.id === editingUser.id ? { ...u, username: editingUser.username } : u))
    setEditingUser(null)
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
                    <button style={styles.editBtn}
                      onClick={() => setEditingUser({ id: user.id, username: user.username, newPassword: '' })}>
                      ✏️ แก้ไข
                    </button>
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

      {editingUser && (
        <div style={styles.overlay} onClick={() => setEditingUser(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>แก้ไข User</h3>
            <form onSubmit={saveEditUser}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.modalInput}
                value={editingUser.username}
                onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                required
              />
              <label style={styles.label}>Password ใหม่ <span style={{ color: '#999', fontWeight: 'normal' }}>(เว้นว่างถ้าไม่เปลี่ยน)</span></label>
              <input
                style={styles.modalInput}
                type="password"
                placeholder="Password ใหม่"
                value={editingUser.newPassword}
                onChange={e => setEditingUser({ ...editingUser, newPassword: e.target.value })}
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setEditingUser(null)}
                  style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc' }}>
                  ยกเลิก
                </button>
                <button type="submit"
                  style={{ padding: '8px 16px', background: '#1677ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  editBtn: { padding: '4px 10px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  promoteBtn: { padding: '4px 10px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  demoteBtn: { padding: '4px 10px', background: '#888', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  revokeBtn: { padding: '4px 10px', background: '#ff7a00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: 24, borderRadius: 8, width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  label: { display: 'block', marginBottom: 4, fontWeight: 'bold', fontSize: 14 },
  modalInput: { width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, marginBottom: 16, boxSizing: 'border-box', fontSize: 14 },
}