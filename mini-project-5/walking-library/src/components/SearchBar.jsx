export default function SearchBar({ value, onChange, resultCount, totalCount, placeholder = "제목 또는 작가명으로 검색" }) {
  const isSearching = value.trim().length > 0;

  return (
    <section className="section-card" style={{ marginBottom: "16px" }}>
      <label htmlFor="book-search" className="form-label">도서 검색</label>
      <input
        id="book-search"
        type="search"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p style={{ margin: "8px 0 0 0", color: "#777", fontSize: "12px", textAlign: "left" }}>
        {isSearching
          ? `${totalCount}권 중 ${resultCount}권이 검색되었습니다.`
          : "검색어를 입력하면 제목 또는 작가명이 해당 글자로 시작하는 책만 표시됩니다."}
      </p>
    </section>
  );
}
