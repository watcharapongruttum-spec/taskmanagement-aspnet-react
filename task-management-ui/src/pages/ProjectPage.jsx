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

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
  };

  const statuses = [
    { label: "Todo", value: 0 },
    { label: "In Progress", value: 1 },
    { label: "Done", value: 2 },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Project Board</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", cursor: "pointer" }}>← กลับ</button>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {statuses.map(s => (
          <TaskColumn key={s.value} title={s.label}
            tasks={tasks.filter(t => Number(t.status) === s.value)}
            onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  );
}