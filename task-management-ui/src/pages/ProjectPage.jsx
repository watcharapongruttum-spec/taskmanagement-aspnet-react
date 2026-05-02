import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import TaskColumn from "../components/TaskColumn";

export default function ProjectPage() {
  const { projectId } = useParams();
const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

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
      <h2>Project Board</h2>
      <div style={{ display: "flex", gap: 16 }}>
        {statuses.map(s => (
          <TaskColumn key={s.value} title={s.label}
            tasks={tasks.filter(t => t.status === s.value)}
            onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  );
}