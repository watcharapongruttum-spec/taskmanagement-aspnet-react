export default function TaskCard({ task, onDelete, onEdit }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  return (
    <div draggable onDragStart={handleDragStart} style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={styles.title}>{task.title}</p>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onEdit(task)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>✏️</button>
          <button onClick={() => onDelete(task.id)} style={styles.deleteBtn}>✕</button>
        </div>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      {task.assigneeUsername && (
        <small style={styles.assignee}>👤 {task.assigneeUsername}</small>
      )}
    </div>
  )
}

const styles = {
  card: { background: "white", padding: "12px", borderRadius: "6px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", marginBottom: "10px", cursor: "grab" },
  title: { fontWeight: "bold", margin: "0 0 6px", fontSize: "14px" },
  desc: { color: "#666", fontSize: "13px", margin: "0 0 6px" },
  assignee: { color: "#999", fontSize: "12px" },
  deleteBtn: { background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "14px", padding: "0 0 0 4px", lineHeight: 1 },
}