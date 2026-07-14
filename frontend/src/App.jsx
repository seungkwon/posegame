import { useEffect, useState } from "react";
import GameScreen from "./components/GameScreen";
import HistoryScreen from "./components/HistoryScreen";
import LoginScreen from "./components/LoginScreen";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("game");
  const [records, setRecords] = useState([]);

  async function fetchRecords(userId) {
    const response = await fetch(`${API_BASE_URL}/games/me/results?user_id=${encodeURIComponent(userId)}`);
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setRecords(data.items);
  }

  async function handleLogin(userId) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId })
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setUser(data);
    localStorage.setItem("posegame-user-id", data.user_id);
    fetchRecords(data.user_id);
  }

  async function saveResult(payload) {
    if (!user) {
      return;
    }

    await fetch(`${API_BASE_URL}/games/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...payload,
        user_id: user.user_id
      })
    });

    fetchRecords(user.user_id);
  }

  function handleLogout() {
    localStorage.removeItem("posegame-user-id");
    setUser(null);
    setView("game");
    setRecords([]);
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("posegame-user-id");
    if (!storedUserId) {
      return;
    }

    handleLogin(storedUserId);
  }, []);

  return (
    <main className="app-shell">
      {!user ? <LoginScreen onLogin={handleLogin} /> : null}
      {user && view === "game" ? (
        <GameScreen
          onLogout={handleLogout}
          onSaveResult={saveResult}
          onShowHistory={() => setView("history")}
          user={user}
        />
      ) : null}
      {user && view === "history" ? (
        <HistoryScreen onBack={() => setView("game")} records={records} />
      ) : null}
    </main>
  );
}
