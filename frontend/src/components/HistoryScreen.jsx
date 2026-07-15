export default function HistoryScreen({ records, onBack }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">My Page</p>
          <h2>Play History</h2>
        </div>
        <button className="ghost-button" onClick={onBack} type="button">
          Back to Game
        </button>
      </div>
      <div className="history-list">
        {records.length === 0 ? (
          <p className="empty-state">No saved rounds yet.</p>
        ) : (
          records.map((record) => (
            <article className="history-card" key={record.id}>
              <strong>{record.is_success ? "Success" : "Fail"}</strong>
              <span>Level {record.level}</span>
              <span>Score {record.score}</span>
              <span>{new Date(record.played_at).toLocaleString("ko-KR")}</span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
