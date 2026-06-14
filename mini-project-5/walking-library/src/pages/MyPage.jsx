import { UserRound } from "lucide-react";
import BookDetail from "../components/BookDetail";

export default function MyPage({
  currentUser,
  books,
  selectedBook,
  onSelectBook,
  onStartEdit,
  onDelete,
  onClose,
  showAccountEdit,
  setShowAccountEdit,
  accountName,
  setAccountName,
  accountPassword,
  setAccountPassword,
  onUpdateAccount,
  onDeleteAccount,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <UserRound size={21} aria-hidden="true" />
          {currentUser?.name}님의 서재
        </h3>
        <button
          type="button"
          className="btn-outline"
          style={{ width: "auto", flexShrink: 0, padding: "8px 14px", fontSize: "13px", marginBottom: 0 }}
          onClick={() => {
            setAccountName(currentUser?.name || "");
            setAccountPassword(currentUser?.password || "");
            setShowAccountEdit((prev) => !prev);
          }}
        >
          계정 관리
        </button>
      </div>

      {showAccountEdit && (
        <div className="auth-wrapper" style={{ minHeight: "auto" }}>
          <div className="auth-card">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <UserRound size={26} color="#ffa042" />
              </div>
              <h2>계정 관리</h2>
              <p>회원 정보를 수정하거나 탈퇴할 수 있어요</p>
            </div>

            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                className="form-input"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                className="form-input"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn-primary" style={{ flex: 1, marginBottom: 0 }} onClick={onUpdateAccount}>
                수정하기
              </button>
              <button type="button" className="btn-outline" style={{ flex: 1, marginBottom: 0 }} onClick={onDeleteAccount}>
                계정 탈퇴
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAccountEdit && (
        <>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>등록한 도서와 북마크한 도서를 확인하고 관리할 수 있습니다.</p>

          <BookDetail
            selectedBook={selectedBook}
            onStartEdit={onStartEdit}
            onDelete={onDelete}
            onClose={onClose}
            isReadOnly={false}
            books={books.filter(b => b.userId === currentUser?.userId)}
            onSelectBook={onSelectBook}
            isMyPage={true}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
}