export default function HistoryScreen({ records, onBack }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">My Page</p>
          <h2>플레이 기록</h2>
        </div>
        <button className="ghost-button" onClick={onBack} type="button">
          게임으로 돌아가기
        </button>
      </div>
      <div className="history-list">
        {records.length === 0 ? (
          <p className="empty-state">아직 저장된 게임 기록이 없습니다.</p>
        ) : (
          records.map((record) => (
            <article className="history-card" key={record.id}>
              <strong>{record.is_success ? "성공" : "실패"}</strong>
              <span>레벨 {record.level}</span>
              <span>점수 {record.score}</span>
              <span>{new Date(record.played_at).toLocaleString("ko-KR")}</span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
