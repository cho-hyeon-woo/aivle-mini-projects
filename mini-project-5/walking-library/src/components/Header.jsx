import { BookPlus, Home, Search, UserRound, LogIn, LogOut } from "lucide-react";

export default function Header({ currentMenu, onMenuChange, searchQuery, setSearchQuery, currentUser, onLogout }) {
  const menuItems = [
    { id: "home", label: "홈", Icon: Home },
    { id: "register", label: "도서 등록하기", Icon: BookPlus },
    currentUser
      ? { id: "mypage", label: "마이 페이지", Icon: UserRound }
      : { id: "login", label: "로그인", Icon: LogIn },
  ];

  return (
    <header className="header-root">
      <div className="header-brand brand-panel">
        <h1>Walking Library</h1>
        <p>책과 산책하는 시간</p>
      </div>

      <div className="header-search-row">
        <input
          type="text"
          className="header-search-input"
          placeholder="도서 검색하기"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="header-search-btn search-button">
          <Search size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <div className="header-nav">
        <nav className="header-nav-tabs nav-tabs">
          {menuItems.map((item) => {
            const isActive = currentMenu === item.id;
            const { Icon } = item;
            return (
              <button
                key={item.id}
                className={`header-nav-tab nav-tab${isActive ? " header-nav-tab--active" : ""}`}
                onClick={() => onMenuChange(item.id)}
              >
                <Icon size={19} strokeWidth={2.1} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {currentUser && (
          <button className="header-logout-btn" onClick={onLogout} title="로그아웃">
            <LogOut size={18} strokeWidth={2} />
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}