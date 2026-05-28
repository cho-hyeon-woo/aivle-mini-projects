//1.npm install로 의존성 설치
//2. npm run dev로 vite 페이지 실행
//3. npm install json-server@0.17.4로 json서버 의존성 설치
//4. npx json-server --watch db.json으로 json 서버 실행
//5. npm install react-toastify react-dropzone lucide-react motion으로 UI 라이브러리 의존성 설치

/* - 상태 관리 (메뉴 탭, 도서 목록 데이터, AI API 세팅 변수, 검색어 등)
 * - json-server 및 OpenAI Image API 연동 및 제어
 * - 홈 로비(추천/목록 그리드), 도서 등록(Form), 마이페이지(작가 전용 2단 뷰)
 */

import { useState, useEffect, useRef } from "react";
import { BookOpen, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookDetail from "./components/BookDetail";
import "react-toastify/dist/ReactToastify.css";

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

function buildBookCoverPrompt(title, author, content, bookGenre, coverStyle) {
  return [
    "Create a polished vertical book cover illustration.",
    "Use an artistic, publication-ready style suitable for a Korean creative writing app.",
    `Genre: ${bookGenre}`,
    `Cover style: ${coverStyle}`,
    `Title: ${title}`,
    `Author: ${author}`,
    `Book content: ${content}`,
    "The cover should visually reflect the selected genre, mood, and core theme of the book.",
    "Do not include mockup borders, UI elements, watermarks, or extra explanation.",
  ].join("\n");
}

export default function App() {
  const dbAddress = "http://localhost:3000/books";

  const [currentMenu, setCurrentMenu] = useState("home");
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [randomBook, setRandomBook] = useState(null);  

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [detailViewSource, setDetailViewSource] = useState(null);
  const recommendDetailRef = useRef(null);
  const listDetailRef = useRef(null);

  const [apiKey, setApiKey] = useState("");
  const [imageModel, setImageModel] = useState("gpt-image-2");
  const [imageSize, setImageSize] = useState("1024x1536");
  const [imageQuality, setImageQuality] = useState("low");
  const [outputFormat, setOutputFormat] = useState("png");
  const [bookGenre, setBookGenre] = useState("실용서적");
  const [coverStyle, setCoverStyle] = useState("미니멀");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const [tempPreviewImage, setTempPreviewImage] = useState(""); 
  const [localImageBase64, setLocalImageBase64] = useState("");
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // 검색 시 debouncedSearchQuery를 기준으로 작동
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );
  
  

  const fetchBooks = async () => {
    try {
      const res = await fetch(dbAddress);
      if (!res.ok) throw new Error("도서 목록을 불러오지 못했습니다.");
      const data = await res.json();
      setBooks(data);
      
      if (data.length > 0 && !randomBook) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomBook(data[randomIndex]);
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  

  const handleInitiatePreview = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      toast.warning("모든 필수 항목을 기입해 주세요.");
      return;
    }

    if (!apiKey.trim()) {
      if (localImageBase64) {
        setTempPreviewImage(localImageBase64);
        toast.info("업로드한 이미지로 표지 미리보기를 준비했습니다.");
      } else {
        toast.warning("OpenAI API Key를 입력하거나 표지 이미지를 업로드해 주세요.");
      }
      return;
    }

    setIsGeneratingCover(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let prompt = buildBookCoverPrompt(title, author, content, bookGenre, coverStyle);
      if (localImageBase64) {
        const pureBase64 = localImageBase64.split(",")[1];
        const visionRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: "Analyze this rough sketch/storyboard for a book cover. Describe its layout, composition, subject placement, and implied framing in English so that DALL-E 3 can replicate this exact composition. Keep it concise." 
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${pureBase64}`
                  }
                }
              ]
            }
          ]
        }),
        signal: controller.signal
      });

      if (visionRes.ok) {
        const visionData = await visionRes.json();
        const sketchDescription = visionData.choices?.[0]?.message?.content;
        
        if (sketchDescription) {
          prompt += `\n\n[CRITICAL COMPOSITION GUIDE]: Replicate the exact composition and layout described here: ${sketchDescription}`;
        }
      }
    }
      const openAiRes = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
        body: JSON.stringify({ model: imageModel, prompt, n: 1, size: imageSize, quality: imageQuality, output_format: outputFormat }),
        signal: controller.signal
      });

      if (!openAiRes.ok) throw new Error("OpenAI 서버 응답 실패");

      const data = await openAiRes.json();
      const b64Json = data.data?.[0]?.b64_json;
      if (!b64Json) throw new Error("이미지 본문이 누락되었습니다.");

      setTempPreviewImage(`data:image/${outputFormat};base64,${b64Json}`);
      toast.success("표지 미리보기가 생성되었습니다.");
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("이미지 생성 취소됨");
        toast.info("이미지 생성을 취소했습니다.");
      } else {
        toast.error(`표지 생성 실패: ${err.message}`);
      }
    } finally {
      setIsGeneratingCover(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  const handleFinalSave = async () => {
    const nowISO = new Date().toISOString();
    const wasEditing = isEditing;
    const payload = {
      title, author, content, genre: bookGenre, style: coverStyle,
      imageModel, imageSize, imageQuality, outputFormat,
      coverImageUrl: tempPreviewImage,
      updatedAt: nowISO
    };

    try {
      if (isEditing) {
        const res = await fetch(`${dbAddress}/${selectedBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selectedBook, ...payload }),
        });
        if (!res.ok) throw new Error("도서 수정 요청에 실패했습니다.");
        setIsEditing(false);
      } else {
        const res = await fetch(dbAddress, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: nowISO }),
        });
        if (!res.ok) throw new Error("도서 등록 요청에 실패했습니다.");
      }

      setTitle(""); setAuthor(""); setContent(""); setSelectedBook(null);
      setTempPreviewImage(""); setLocalImageBase64(""); handleCloseDetail();
      fetchBooks();
      setCurrentMenu("home");
      toast.success(wasEditing ? "도서 정보가 수정되었습니다." : "도서가 등록되었습니다.");
    } catch (err) {
      toast.error(err.message || "도서 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 책을 삭제하시겠습니까?")) {
      try {
        const res = await fetch(`${dbAddress}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("도서 삭제 요청에 실패했습니다.");
        setSelectedBook(null); setDetailViewSource(null);
        if (randomBook?.id === id) setRandomBook(null);
        fetchBooks();
        toast.success("도서가 삭제되었습니다.");
      } catch (err) {
        toast.error(err.message || "도서 삭제에 실패했습니다.");
      }
    }
  };

  const startEdit = () => {
    setTitle(selectedBook.title); setAuthor(selectedBook.author); setContent(selectedBook.content);
    setBookGenre(selectedBook.genre || "실용서적"); setCoverStyle(selectedBook.style || "미니멀");
    setTempPreviewImage(selectedBook.coverImageUrl || "");
    setIsEditing(true); setCurrentMenu("register"); 
  };

  const handleOpenDetail = (book, source) => {
    setSelectedBook(book); setDetailViewSource(source);
    setTimeout(() => {
      if (source === "recommend" && recommendDetailRef.current) {
        recommendDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (source === "list" && listDetailRef.current) {
        listDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null); setDetailViewSource(null);
  };

  return (
    <>
    <div className="app-shell" style={{ padding: "20px", width: "100%", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", background: "#fff", boxSizing: "border-box" }}>
      <Header currentMenu={currentMenu} onMenuChange={(menu) => { setCurrentMenu(menu); if (menu !== "mypage") handleCloseDetail(); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* 홈 화면 */}
      {currentMenu === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
          
          {/*  이 달의 추천 도서*/}
          {randomBook && !searchQuery && (
            <section className="recommend-section" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", textAlign: "center", color: "#444" }}>이 달의 추천 도서</h3>
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "120px", height: "180px", background: "#ccc", borderRadius: "4px", flexShrink: 0, overflow: "hidden", border: "1px solid #bbb" }}>
                  {randomBook.coverImageUrl ? <img src={randomBook.coverImageUrl} alt="표지" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center", padding: "5px", fontSize: "11px", color: "#666" }}>생성된 이미지가 없습니다!</div>}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#333" }}>{randomBook.title}</h4>
                  <p style={{ margin: "0 0 10px 0", color: "#555", fontWeight: "bold" }}>{randomBook.author} <span style={{ fontWeight: "normal", color: "#999", fontSize: "13px" }}>글쓴이</span></p>
                  <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px", lineHeight: "1.4" }}>{randomBook.content}</p>
                  <span className="detail-link" style={{ cursor: "pointer", color: "#007bff", fontSize: "13px", fontWeight: "bold" }} onClick={() => handleOpenDetail(randomBook, "recommend")}>[자세히 보기]</span>
                </div>
              </div>
              <div ref={recommendDetailRef}>
                <AnimatePresence mode="wait">
                  {selectedBook && detailViewSource === "recommend" && (
                    <motion.div
                      key={`recommend-${selectedBook.id}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* 하단 도서 목록 영역 */}
          <section className="book-list-section" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#444", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <BookOpen size={19} aria-hidden="true" />
              도서 목록 ({filteredBooks.length}권)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {filteredBooks.map((book) => (
                <motion.div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => handleOpenDetail(book, "list")}
                  style={{ textAlign: "center", cursor: "pointer", border: "1px solid #eee", padding: "10px", borderRadius: "6px", background: "#fff", transition: "transform 0.2s", boxSizing: "border-box" }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <div style={{ width: "100%", height: "160px", background: "#f5f5f5", borderRadius: "4px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", overflow: "hidden" }}>
                    {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ fontSize: "11px", color: "#999" }}>{book.title}</div>}
                  </div>
                  <strong style={{ 
                    display: "block", 
                    width: "100%",              
                    maxWidth: "160px",          
                    fontSize: "13px", 
                    marginBottom: "8px", 
                    textOverflow: "ellipsis", 
                    overflow: "hidden", 
                    whiteSpace: "nowrap", 
                    color: "#333",
                    margin: "0 auto 8px auto"   
                  }}>
                    {book.title}
                  </strong>
                  <span style={{ fontSize: "11px", color: "#999" }}>{book.author}</span>
                </motion.div>
              ))}
            </div>
            {filteredBooks.length === 0 && <p style={{ textAlign: "center", color: "#999", margin: "40px 0" }}>검색된 도서가 없습니다.</p>}
            
            <div ref={listDetailRef}>
              <AnimatePresence mode="wait">
                {selectedBook && detailViewSource === "list" && (
                  <motion.div
                    key={`list-${selectedBook.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

        </div>
      )}

      {/* 도서 등록 대시보드 */}
      {currentMenu === "register" && (
        <BookForm 
          title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} content={content} setContent={setContent}
          apiKey={apiKey} setApiKey={setApiKey} imageModel={imageModel} setImageModel={setImageModel}
          imageSize={imageSize} setImageSize={setImageSize} imageQuality={imageQuality} setImageQuality={setImageQuality}
          outputFormat={outputFormat} setOutputFormat={setOutputFormat} bookGenre={bookGenre} setBookGenre={setBookGenre}
          coverStyle={coverStyle} setCoverStyle={setCoverStyle}
          isEditing={isEditing} onSave={handleInitiatePreview} onFinalSave={handleFinalSave}           
          onCancel={() => { setIsEditing(false); setTitle(""); setAuthor(""); setContent(""); setTempPreviewImage(""); setLocalImageBase64(""); setCurrentMenu("home"); }}
          isGenerating={isGeneratingCover} onCancelGeneration={handleCancelGeneration} 
          tempPreviewImage={tempPreviewImage} setTempPreviewImage={setTempPreviewImage}   
          localImageBase64={localImageBase64} setLocalImageBase64={setLocalImageBase64}
        />
      )}

      {/* 마이 페이지 화면 */}
      {currentMenu === "mypage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
            <UserRound size={21} aria-hidden="true" />
            마이 페이지 (작가 전용 관리실)
          </h3>
          
          <BookDetail 
            selectedBook={selectedBook} 
            onStartEdit={startEdit} 
            onDelete={handleDelete} 
            onClose={handleCloseDetail} 
            isReadOnly={false}
            books={books} 
            onSelectBook={(book) => setSelectedBook(book)} 
            isMyPage={true} 
          />
        </div>
      )}
    </div>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      limit={3}
    />
    </>
  );
}
