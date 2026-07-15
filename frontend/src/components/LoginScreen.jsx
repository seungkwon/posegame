import { OPEN_RESOURCE_POLICY } from "../lib/resources";

export default function LoginScreen({ onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userId = String(formData.get("userId") || "").trim();

    if (!userId) {
      return;
    }

    onLogin(userId);
  }

  return (
    <section className="panel hero-panel">
      <div>
        <p className="eyebrow">Pose Memory Game</p>
        <h1>Memorize the pose sequence and play it back with your body.</h1>
        <p className="lede">
          Watch the target sequence, remember it, and perform it in the same order. Pose
          detection runs in the browser and only the game result is saved to the backend.
        </p>
        <div className="resource-card">
          <p className="eyebrow">Open Resource Policy</p>
          <p className="resource-summary">{OPEN_RESOURCE_POLICY.summary}</p>
          <ul className="resource-list">
            {OPEN_RESOURCE_POLICY.candidates.map((resource) => (
              <li key={resource.name}>
                <strong>{resource.name}</strong>
                <span>{resource.license}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="userId">Player ID</label>
        <input id="userId" name="userId" placeholder="player01" autoComplete="off" maxLength={24} />
        <button type="submit">Start Game</button>
      </form>
    </section>
  );
}
