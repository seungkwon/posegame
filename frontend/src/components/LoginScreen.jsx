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
        <h1>몸으로 기억하는 시퀀스 게임</h1>
        <p className="lede">
          화면이 보여준 자세 순서를 기억했다가 같은 순서로 따라 하세요. 포즈 판정은 브라우저에서 처리되고,
          결과만 서버에 저장됩니다.
        </p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="userId">아이디</label>
        <input id="userId" name="userId" placeholder="player01" autoComplete="off" maxLength={24} />
        <button type="submit">시작하기</button>
      </form>
    </section>
  );
}
