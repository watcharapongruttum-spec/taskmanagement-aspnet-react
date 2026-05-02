import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import TaskColumn from "../components/TaskColumn";

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/tasks/project/${projectId}`).then(res => setTasks(res.data));

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SIGNALR_URL || "http://localhost:5280"}/hubs/tasks`, {
        accessTokenFactory: () => user.accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("TaskUpdated", (updated) => {
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    });

    connection.on("TaskCreated", (created) => {
      setTasks(prev => {
        if (prev.find(t => t.id === created.id)) return prev;
        return [...prev, created];
      });
    });

    connection.start().then(() => connection.invoke("JoinProject", projectId));
    return () => connection.stop();
  }, [projectId]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post("/tasks", { title, description: desc, projectId });
    setTitle("");
    setDesc("");
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
  };

  const updateTask = async (e) => {
    e.preventDefault();
    await api.put(`/tasks/${editingTask.id}`, {
      title: editingTask.title,
      description: editingTask.description,
    });
    setEditingTask(null);
    // SignalR จะ update UI อัตโนมัติ
  };

  const statuses = [
    { label: "Todo", value: 0 },
    { label: "In Progress", value: 1 },
    { label: "Done", value: 2 },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Project Board</h2>
        <button onClick={() => navigate("/dashboard")}
          style={{ padding: "8px 16px", cursor: "pointer", borderRadius: 4, border: "1px solid #ccc" }}>
          ← กลับ
        </button>
      </div>

      <div style={{ background: "white", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 24 }}>
        <h4 style={{ margin: "0 0 12px" }}>➕ สร้าง Task ใหม่</h4>
        <form onSubmit={createTask} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input placeholder="ชื่อ Task *" value={title} onChange={e => setTitle(e.target.value)} required
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, flex: 2, minWidth: 150 }} />
          <input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, flex: 3, minWidth: 150 }} />
          <button type="submit"
            style={{ padding: "8px 20px", background: "#1677ff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            สร้าง
          </button>
        </form>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {statuses.map(s => (
          <TaskColumn key={s.value} title={s.label}
            statusValue={s.value}
            tasks={tasks.filter(t => Number(t.status) === s.value)}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
            onEdit={(task) => setEditingTask({ id: task.id, title: task.title, description: task.description || '' })} />
        ))}
      </div>

      {editingTask && (
        <div style={overlayStyle} onClick={() => setEditingTask(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>แก้ไข Task</h3>
            <form onSubmit={updateTask}>
              <input
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, width: '100%', marginBottom: 10, boxSizing: 'border-box' }}
                placeholder="ชื่อ Task"
                value={editingTask.title}
                onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
              <input
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, width: '100%', marginBottom: 16, boxSizing: 'border-box' }}
                placeholder="Description"
                value={editingTask.description}
                onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingTask(null)}
                  style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc' }}>ยกเลิก</button>
                <button type="submit"
                  style={{ padding: '8px 16px', background: '#1677ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalStyle = { background: 'white', padding: 24, borderRadius: 8, width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }