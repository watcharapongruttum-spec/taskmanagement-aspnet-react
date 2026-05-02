import TaskCard from './TaskCard'

const statusLabel = { 0: 'Todo', 1: 'In Progress', 2: 'Done' }
const statusColor = { 0: '#faad14', 1: '#1677ff', 2: '#52c41a' }

export default function TaskColumn({ status, tasks }) {
  const filtered = tasks.filter((t) => t.status === status)

  return (
    <div style={styles.column}>
      <div style={{ ...styles.header, borderTop: `3px solid ${statusColor[status]}` }}>
        <span>{statusLabel[status]}</span>
        <span style={styles.count}>{filtered.length}</span>
      </div>
      {filtered.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {filtered.length === 0 && <p style={styles.empty}>ไม่มี Task</p>}
    </div>
  )
}

const styles = {
  column: { background: '#f5f5f5', borderRadius: '8px', padding: '16px', flex: 1, minWidth: '250px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px', fontWeight: 'bold' },
  count: { background: '#ddd', borderRadius: '10px', padding: '2px 8px', fontSize: '13px' },
  empty: { color: '#bbb', textAlign: 'center', fontSize: '13px' },
}