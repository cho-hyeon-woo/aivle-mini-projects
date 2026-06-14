import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  FilePenLine,
  Image as ImageIcon,
  ImageUp,
  PenLine,
  Settings,
  Trash2,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDropzone } from "react-dropzone";

const ALADIN_TTB_KEY = "ttbyh9909201128001";

export default function BookForm({
  title, setTitle,
  author, setAuthor,
  content, setContent,
  apiKey, setApiKey,
  imageModel, setImageModel,
  imageSize, setImageSize,
  imageQuality, setImageQuality,
  outputFormat, setOutputFormat,
  bookGenre, setBookGenre,
  coverStyle, setCoverStyle,
  isEditing, onSave, onFinalSave, onCancel,
  isGenerating, onCancelGeneration,
  tempPreviewImage, setTempPreviewImage,
  setLocalImageBase64,
  tags, setTags,
  onGenerateTags
}) {
  const [localPreview, setLocalPreview] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleTitleSearch = async () => {
    if (!searchTitle.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const url = `/aladin/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_TTB_KEY}&Query=${encodeURIComponent(searchTitle.trim())}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.item && data.item.length > 0) {
        setSearchResults(data.item);
      } else {
        setSearchError("검색 결과가 없습니다. 도서명을 다시 확인해 주세요.");
      }
    } catch (e) {
      setSearchError("검색 중 오류가 발생했습니다. (CORS 문제이거나 API 키를 확인해주세요)");
      console.error(e);
    }
    setIsSearching(false);
  };

  const handleSelectBook = (book) => {
    setTitle(book.title || "");
    setAuthor(book.author || "");
    setContent(book.description || "");
    const categoryName = book.categoryName || "";
    if (categoryName.includes("소설")) setBookGenre("소설");
    else if (categoryName.includes("시") || categoryName.includes("에세이")) setBookGenre("시/에세이");
    else if (categoryName.includes("인문")) setBookGenre("인문학");
    else if (categoryName.includes("판타지") || categoryName.includes("SF")) setBookGenre("판타지/SF");
    else setBookGenre("실용서적");
    setSearchResults([]);
    setSearchTitle("");
  };

  const handleLocalImageFile = useCallback((file) => {
    if (!file) return;
    setLocalPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    const reader = new FileReader();
    reader.onloadend = () => setLocalImageBase64(reader.result);
    reader.readAsDataURL(file);
  }, [setLocalImageBase64]);

  const handleDrop = useCallback((acceptedFiles) => handleLocalImageFile(acceptedFiles[0]), [handleLocalImageFile]);

  const { getRootProps, getInputProps, isDragActive, isFocused, fileRejections } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  useEffect(() => {
    return () => { if (localPreview) URL.revokeObjectURL(localPreview); };
  }, [localPreview]);

  const handleClearLocalImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setLocalImageBase64("");
  };

  const disabled = !!tempPreviewImage;

  return (
    <section style={{ width: "100%", boxSizing: "border-box", marginBottom: "30px", background: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #ddd", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "relative" }}>

      {/* 이미지 생성 중 오버레이 */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.65)", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999, color: "#fff", textAlign: "center" }}
          >
            <motion.div animate={{ opacity: [0.55, 1, 0.55], scale: [0.98, 1.04, 0.98] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</motion.div>
            <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 10px 0" }}>이미지 생성 후 등록됩니다.</p>
            <p style={{ fontSize: "13px", color: "#ccc", margin: "0 0 20px 0" }}>잠시만 기다려주세요...</p>
            <motion.button type="button" onClick={onCancelGeneration} whileTap={{ scale: 0.96 }} style={{ padding: "10px 24px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              🛑 생성 취소하기
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 style={{ marginTop: 0, textAlign: "center", marginBottom: "25px", color: "#333", fontSize: "22px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {isEditing ? <FilePenLine size={23} aria-hidden="true" /> : <PenLine size={23} aria-hidden="true" />}
        {isEditing ? "도서 수정하기" : "도서 등록하기"}
      </h3>

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} style={{ display: "flex", gap: "25px", width: "100%", alignItems: "flex-start" }}>

        {/* 좌측: 이미지 영역 */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "15px", minWidth: "320px" }}>
          <div style={{ width: "100%", height: "440px", border: tempPreviewImage ? "1px solid #ddd" : "2px dashed #ccc", borderRadius: "8px", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: tempPreviewImage ? "0" : "20px", boxSizing: "border-box", textAlign: "center", overflow: "hidden" }}>
            {tempPreviewImage ? (
              <img src={tempPreviewImage} alt="표지 미리보기" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <>
                <ImageIcon size={42} color="#94a3b8" style={{ marginBottom: "10px" }} aria-hidden="true" />
                <strong style={{ fontSize: "16px", color: "#333", marginBottom: "5px" }}>생성 이미지 표시</strong>
                <p style={{ fontSize: "12px", color: "#777", margin: 0, lineHeight: "1.5" }}>
                  오른쪽에서 설정을 마친 후 [미리보기]를 누르면<br />여기에 AI 표지 혹은 업로드 파일이 표기됩니다.
                </p>
              </>
            )}
          </div>

          {!tempPreviewImage && (
            <div style={{ width: "100%", minHeight: "300px", border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "#fdfdfd", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", fontWeight: "bold", color: "#555", marginBottom: "2px", textAlign: "center", lineHeight: "1.5" }}>
                <ImageUp size={18} aria-hidden="true" />
                <span>원하는 도서 이미지 콘티 업로드하시면<br />콘티를 바탕으로 이미지 생성합니다!</span>
              </label>
              <motion.div
                {...getRootProps()}
                animate={{ scale: isDragActive ? 1.01 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                style={{ width: "100%", minHeight: "170px", border: isDragActive || isFocused ? "2px dashed #ffa042" : "2px dashed #cbd5e1", borderRadius: "8px", background: isDragActive ? "#fff7ed" : "#f8fafc", boxSizing: "border-box", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s ease, background 0.2s ease" }}
              >
                <input {...getInputProps()} />
                {localPreview ? (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }} style={{ width: "100%", height: "138px", overflow: "hidden", borderRadius: "6px", background: "#fff" }}>
                    <img src={localPreview} alt="업로드 이미지 미리보기" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </motion.div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
                    <ImageUp size={34} color="#94a3b8" aria-hidden="true" />
                    <strong style={{ fontSize: "13px", color: "#334155" }}>{isDragActive ? "이미지를 여기에 놓아주세요" : "이미지를 드래그하거나 클릭해 업로드"}</strong>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>PNG, JPG, WEBP 이미지 파일</span>
                  </div>
                )}
              </motion.div>
              {fileRejections.length > 0 && <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#dc3545" }}>이미지 파일만 업로드할 수 있습니다.</p>}
              {localPreview && (
                <button type="button" onClick={handleClearLocalImage} style={{ padding: "6px 14px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginTop: "auto", width: "100%" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    <Trash2 size={13} aria-hidden="true" />파일 삭제
                  </span>
                </button>
              )}
            </div>
          )}

          {tempPreviewImage && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f4f9ff", padding: "15px", borderRadius: "8px", border: "1px solid #bae1ff" }}>
              <p style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#0056b3", fontWeight: "bold", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <CheckCircle2 size={16} aria-hidden="true" />표지 매칭 완료! 등록하시겠습니까?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={onFinalSave} style={{ flex: 1, padding: "10px 0", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", whiteSpace: "nowrap" }}>✅ 최종 등록</button>
                {apiKey.trim() && (
                  <button type="button" onClick={onSave} style={{ flex: 1, padding: "10px 0", background: "#ffa042", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", whiteSpace: "nowrap" }}>🔄 다시 생성</button>
                )}
                <button type="button" onClick={() => setTempPreviewImage("")} style={{ flex: 1, padding: "10px 0", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px" }}><X size={13} aria-hidden="true" />취소</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 우측: 메타데이터 설정 */}
        <div style={{ flex: "1.5", display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>

          {/* 알라딘 도서 검색 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
            <label className="form-label">🔍 도서명으로 검색하여 불러오기 (알라딘)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="검색할 도서 제목을 입력하세요"
                value={searchTitle}
                onChange={(e) => { setSearchTitle(e.target.value); setSearchError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSearch()}
                disabled={disabled || isSearching}
                style={{ background: disabled ? "#f5f5f5" : "#fff" }}
              />
              <button
                type="button"
                onClick={handleTitleSearch}
                disabled={disabled || isSearching || !searchTitle.trim()}
                style={{ padding: "10px 16px", background: isSearching ? "#aaa" : "#ffa042", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", whiteSpace: "nowrap" }}
              >
                {isSearching ? "검색 중..." : "도서 검색"}
              </button>
            </div>
            {searchError && <p style={{ margin: 0, fontSize: "12px", color: "#ef4444" }}>{searchError}</p>}
            {searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "62px", left: 0, right: 0, background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", maxHeight: "220px", overflowY: "auto", zIndex: 10, padding: "5px 0" }}>
                {searchResults.map((book, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectBook(book)}
                    style={{ padding: "10px 15px", cursor: "pointer", borderBottom: idx === searchResults.length - 1 ? "none" : "1px solid #f1f5f9", fontSize: "13px", display: "flex", flexDirection: "column", gap: "2px" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                  >
                    <strong style={{ color: "#1e293b", fontSize: "13px" }}>{book.title}</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>✍️ 저자: {book.author || "미상"} {book.publisher && `| 출판사: ${book.publisher}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 제목 & 저자 */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "5px" }}>
              <label className="form-label">도서 제목</label>
              <input type="text" className="form-input" placeholder="책 제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} disabled={disabled} style={{ background: disabled ? "#f5f5f5" : "#fff" }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
              <label className="form-label">작가지망생 이름</label>
              <input type="text" className="form-input" placeholder="이름" value={author} onChange={(e) => setAuthor(e.target.value)} disabled={disabled} style={{ background: disabled ? "#f5f5f5" : "#fff" }} />
            </div>
          </div>

          {/* OpenAI 상세 설정 */}
          <fieldset style={{ border: "1px solid #007bff", borderRadius: "8px", padding: "15px", background: "#f7faff", margin: 0 }}>
            <legend style={{ color: "#007bff", fontWeight: "bold", fontSize: "13px", padding: "0 6px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Settings size={14} aria-hidden="true" />
                OpenAI API & 표지 상세 설정
              </span>
            </legend>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="form-label">OpenAI API Key</label>
                <input type="password" className="form-input" placeholder="sk-... (비워둘 시 좌측 업로드 파일이 표지로 등록됩니다)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} disabled={disabled} style={{ background: disabled ? "#f5f5f5" : "#fff", border: "1px solid #b3d7ff" }} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">이미지 모델</label>
                  <select value={imageModel} onChange={(e) => setImageModel(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="gpt-image-2">gpt-image-2</option>
                    <option value="dall-e-3">dall-e-3</option>
                    <option value="dall-e-2">dall-e-2</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">이미지 크기</label>
                  <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="1024x1536">1024x1536 (세로형)</option>
                    <option value="1024x1024">1024x1024 (정사각형)</option>
                    <option value="1792x1024">1792x1024 (가로형)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">이미지 품질</label>
                  <select value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="low">low (빠른 생성)</option>
                    <option value="medium">medium (일반)</option>
                    <option value="high">high (고화질)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">파일 확장자</label>
                  <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="png">png</option>
                    <option value="jpg">jpg</option>
                    <option value="webp">webp</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">도서 장르</label>
                  <select value={bookGenre} onChange={(e) => setBookGenre(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="실용서적">실용서적</option>
                    <option value="소설">소설</option>
                    <option value="시/에세이">시/에세이</option>
                    <option value="인문학">인문학</option>
                    <option value="판타지/SF">판타지/SF</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">표지 무드/스타일</label>
                  <select value={coverStyle} onChange={(e) => setCoverStyle(e.target.value)} disabled={disabled} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px" }}>
                    <option value="Modern Korean webtoon style, crisp digital line art, dynamic manhwa character illustration">웹툰</option>
                    <option value="High-quality Japanese anime style, dark fantasy atmosphere, cinematic cel-shading">애니메이션</option>
                    <option value="일러스트">일러스트</option>
                    <option value="수채화">수채화</option>
                    <option value="Photorealistic, real human photography style, highly detailed portrait, 8k resolution">실사화</option>
                  </select>
                </div>
              </div>
            </div>
          </fieldset>

          {/* 줄거리 */}
          <div>
            <label className="form-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <BookOpen size={14} aria-hidden="true" />
              줄거리 요약 (본문 내용)
            </label>
            <textarea
              className="form-input"
              placeholder="책의 줄거리를 입력하세요. 표지 생성의 베이스가 됩니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={disabled}
              rows="5"
              style={{ resize: "none", lineHeight: "1.5", background: disabled ? "#f5f5f5" : "#fff" }}
            />
          </div>

          {/* 태그 자동 생성 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="form-label">태그</label>
              <button type="button" onClick={onGenerateTags}
                style={{ padding: "6px 12px", background: "#6f42c1", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>
                ✨ AI 태그 생성
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              {tags.map((tag, idx) => (
                <span key={idx} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "20px", padding: "4px 10px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "14px", lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" className="form-input" placeholder="태그 직접 추가"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (e.target.value.trim()) { setTags([...tags, e.target.value.trim()]); e.target.value = ""; } } }}
                />
            </div>
          </div>

          {!tempPreviewImage && (
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button type="submit" style={{ flex: 2, padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
                {apiKey.trim() ? "🪄 표지 이미지 미리보기 생성" : "🚀 도서 바로 등록하기"}
              </button>
              <button type="button" onClick={onCancel} style={{ flex: 1, padding: "12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" }}>
                취소
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
