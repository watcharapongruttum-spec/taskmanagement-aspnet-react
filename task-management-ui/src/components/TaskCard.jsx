export default function TaskCard({ task }) {
  return (
    <div style={styles.card}>
      <p style={styles.title}>{task.title}</p>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      {task.assigneeUsername && (
        <small style={styles.assignee}>👤 {task.assigneeUsername}</small>
      )}
    </div>
  )
}

const styles = {
  card: { background: 'white', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '10px' },
  title: { fontWeight: 'bold', margin: '0 0 6px', fontSize: '14px' },
  desc: { color: '#666', fontSize: '13px', margin: '0 0 6px' },
  assignee: { color: '#999', fontSize: '12px' },
}