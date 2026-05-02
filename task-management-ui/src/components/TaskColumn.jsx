import TaskCard from './TaskCard'

const statusColor = { 'Todo': '#faad14', 'In Progress': '#1677ff', 'Done': '#52c41a' }

export default function TaskColumn({ title, tasks, onUpdateStatus }) {
  return (
    <div style={styles.column}>
      <div style={{ ...styles.header, borderTop: `3px solid ${statusColor[title] || '#ccc'}` }}>
        <span>{title}</span>
        <span style={styles.count}>{tasks.length}</span>
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdateStatus={onUpdateStatus} />
      ))}
      {tasks.length === 0 && <p style={styles.empty}>ไม่มี Task</p>}
    </div>
  )
}

const styles = {
  column: { background: '#f5f5f5', borderRadius: '8px', padding: '16px', flex: 1, minWidth: '250px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px', fontWeight: 'bold' },
  count: { background: '#ddd', borderRadius: '10px', padding: '2px 8px', fontSize: '13px' },
  empty: { color: '#bbb', textAlign: 'center', fontSize: '13px' },
}