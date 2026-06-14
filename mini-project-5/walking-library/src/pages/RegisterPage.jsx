import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import BookForm from "../components/BookForm";

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

function getApiBaseUrl(dbAddress) {
  return dbAddress.replace(/\/books\/?$/, "");
}

function dataUrlToFile(dataUrl, fallbackExtension = "png") {
  const [header, base64Data] = dataUrl.split(",");
  if (!header || !base64Data) throw new Error("Invalid image data.");

  const mimeMatch = header.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);
  const mimeType = mimeMatch?.[1] || `image/${fallbackExtension}`;
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || fallbackExtension;
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], `cover.${extension}`, { type: mimeType });
}

async function uploadCoverImageIfNeeded(imageValue, dbAddress, outputFormat) {
  if (!imageValue || !imageValue.startsWith("data:image/")) {
    return imageValue;
  }

  const formData = new FormData();
  formData.append("file", dataUrlToFile(imageValue, outputFormat));

  const res = await fetch(`${getApiBaseUrl(dbAddress)}/covers/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`표지 이미지 업로드에 실패했습니다. (${res.status})`);

  const data = await res.json();
  if (!data.url) throw new Error("표지 이미지 URL을 받지 못했습니다.");
  return data.url;
}

function translateOpenAiError(message) {
  if (!message) return "OpenAI 서버 응답 실패";

  if (message.includes("rejected by the safety system")) {
    return "입력하신 제목/내용/저자 정보가 OpenAI의 콘텐츠 안전 정책에 의해 거부되었습니다. 실존 인물명, 유명 작품/캐릭터명, 폭력적이거나 선정적인 표현이 포함되어 있지 않은지 확인해 주세요.";
  }
  if (message.includes("content_policy_violation") || message.includes("content policy")) {
    return "입력하신 내용이 OpenAI의 콘텐츠 정책에 위반되어 표지 생성이 거부되었습니다. 책 제목/내용/저자 정보를 수정한 후 다시 시도해 주세요.";
  }
  if (message.includes("Incorrect API key") || message.includes("invalid_api_key")) {
    return "OpenAI API Key가 올바르지 않습니다. API Key를 다시 확인해 주세요.";
  }
  if (message.includes("model") && (message.includes("does not exist") || message.includes("not found"))) {
    return "선택한 이미지 모델을 사용할 수 없습니다. 모델 설정을 확인해 주세요.";
  }
  if (message.includes("Rate limit") || message.includes("rate_limit")) {
    return "OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return message;
}

function buildBookCoverPrompt(title, author, content, bookGenre, coverStyle, imageSize) {
  const orientation = imageSize === "1792x1024"
    ? "horizontal (landscape)"
    : imageSize === "1024x1024"
      ? "square"
      : "vertical (portrait)";

  return [
    `Create a polished ${orientation} book cover illustration.`,
    `The illustration must be composed specifically for a ${orientation} frame, fully filling the entire canvas edge-to-edge with no empty margins, borders, or letterboxing on any side.`,
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

export default function RegisterPage({ dbAddress, currentUser, selectedBook, isEditing, onSaveSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [imageModel, setImageModel] = useState("gpt-image-2");
  const [imageSize, setImageSize] = useState("1024x1536");
  const [imageQuality, setImageQuality] = useState("low");
  const [outputFormat, setOutputFormat] = useState("png");
  const [bookGenre, setBookGenre] = useState("실용서적");
  const [coverStyle, setCoverStyle] = useState("미니멀");
  const [tags, setTags] = useState([]);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [tempPreviewImage, setTempPreviewImage] = useState("");
  const [localImageBase64, setLocalImageBase64] = useState("");
  const abortControllerRef = useRef(null);

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (isEditing && selectedBook) {
      setTitle(selectedBook.title || "");
      setAuthor(selectedBook.author || "");
      setContent(selectedBook.content || "");
      setBookGenre(selectedBook.genre || "실용서적");
      setCoverStyle(selectedBook.style || "미니멀");
      setTempPreviewImage(selectedBook.coverImageUrl || "");
    } else {
      // 새 등록일 경우 (컴포넌트 재사용 대비)
      setTitle("");
      setAuthor("");
      setContent("");
      setTempPreviewImage("");
      setLocalImageBase64("");
    }
  }, [isEditing, selectedBook]);

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
      let prompt = buildBookCoverPrompt(title, author, content, bookGenre, coverStyle, imageSize);
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
            messages: [{
              role: "user",
              content: [
                { type: "text", text: "Analyze this rough sketch/storyboard for a book cover. Describe its layout, composition, subject placement, and implied framing in English so that DALL-E 3 can replicate this exact composition. Keep it concise." },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${pureBase64}` } }
              ]
            }]
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

      if (!openAiRes.ok) {
        const errorData = await openAiRes.json().catch(() => ({}));
        throw new Error(translateOpenAiError(errorData.error?.message));
      }

      const data = await openAiRes.json();
      const b64Json = data.data?.[0]?.b64_json;
      if (!b64Json) throw new Error("이미지 본문이 누락되었습니다.");

      setTempPreviewImage(`data:image/${outputFormat};base64,${b64Json}`);
      toast.success("표지 미리보기가 생성되었습니다.");
    } catch (err) {
      if (err.name === "AbortError") {
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

  const handleGenerateTags = async () => {
  if (!content.trim()) {
    toast.warning("줄거리를 먼저 입력해주세요.");
    return;
  }
  if (!apiKey.trim()) {
    toast.warning("OpenAI API Key를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `다음 책 줄거리를 읽고 태그를 5~7개 생성해줘. 반드시 JSON 배열 형식으로만 답해줘. 예시: ["태그1", "태그2"]\n\n줄거리: ${content}`
        }]
      })
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(text);
    setTags(parsed);
    toast.success("태그가 생성되었습니다.");
  } catch (err) {
    toast.error("태그 생성에 실패했습니다.");
  }
  };

  // 💡 여기에 예외 처리 3중 방어막이 적용되었습니다!
  const handleFinalSave = async () => {
    const nowISO = new Date().toISOString();
    const wasEditing = isEditing;

    try {
      const savedCoverImageUrl = await uploadCoverImageIfNeeded(tempPreviewImage, dbAddress, outputFormat);
      const payload = {
        title, author, content, genre: bookGenre, style: coverStyle,
        imageModel, imageSize, imageQuality, outputFormat,
        coverImageUrl: savedCoverImageUrl,
        userId: currentUser?.userId,
        updatedAt: nowISO,
        tags: tags.join(",")
      };

      if (isEditing) {
        const res = await fetch(`${dbAddress}/update/${selectedBook.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selectedBook, ...payload }),
        });
        
        // 백엔드 에러 메시지 뜯어보기
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "도서 수정 요청에 실패했습니다.");
        }
      } else {
        const res = await fetch(dbAddress, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: nowISO }),
        });
        
        // 백엔드 에러 메시지 뜯어보기
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "도서 등록 요청에 실패했습니다.");
        }
      }

      toast.success(wasEditing ? "도서 정보가 수정되었습니다." : "도서가 등록되었습니다.");
      
      // 저장 성공 후 임시 이미지 초기화
      setTempPreviewImage("");
      setLocalImageBase64("");
      onSaveSuccess();
      
    } catch (err) {
      // 서버 꺼짐 감지 및 에러 알림 띄우기
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        toast.error("서버와 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요. 🔌");
      } else {
        toast.error(err.message || "도서 저장에 실패했습니다.");
      }
    }
  };

  return (
    <BookForm
      title={title} setTitle={setTitle}
      author={author} setAuthor={setAuthor}
      content={content} setContent={setContent}
      apiKey={apiKey} setApiKey={setApiKey}
      imageModel={imageModel} setImageModel={setImageModel}
      imageSize={imageSize} setImageSize={setImageSize}
      imageQuality={imageQuality} setImageQuality={setImageQuality}
      outputFormat={outputFormat} setOutputFormat={setOutputFormat}
      bookGenre={bookGenre} setBookGenre={setBookGenre}
      coverStyle={coverStyle} setCoverStyle={setCoverStyle}
      tags={tags} setTags={setTags}
      onGenerateTags={handleGenerateTags}
      isEditing={isEditing}
      onSave={handleInitiatePreview}
      onFinalSave={handleFinalSave}
      onCancel={onCancel}
      isGenerating={isGeneratingCover}
      onCancelGeneration={handleCancelGeneration}
      tempPreviewImage={tempPreviewImage}
      setTempPreviewImage={setTempPreviewImage}
      localImageBase64={localImageBase64}
      setLocalImageBase64={setLocalImageBase64}
    />
  );
}