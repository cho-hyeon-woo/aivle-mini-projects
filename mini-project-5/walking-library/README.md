# 걷기가 서재 : 작가의 산책

React + json-server + OpenAI Image API를 사용한 도서 관리 미니프로젝트입니다.  
작가 지망생이 자신의 책을 등록하고, AI가 자동으로 표지를 생성해주는 서비스입니다.

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 19, Vite |
| 로컬 DB | json-server 0.17.4 |
| AI 이미지 | OpenAI Image API (`gpt-image-2`, `dall-e-3`, `dall-e-2`) |

---

## 주요 기능

- **홈 화면** : 이 달의 추천 도서(랜덤) + 전체 도서 그리드 목록 표시
- **도서 검색** : 제목 / 저자명 기준 실시간 검색 (0.4초 디바운스 적용)
- **도서 상세** : 표지 이미지, 제목, 저자, 장르, 줄거리, 작성일 표시
- **도서 등록** : 제목·저자·줄거리 입력 후 AI 표지 생성 또는 로컬 이미지 업로드
- **도서 수정 / 삭제** : 마이페이지에서 등록한 도서 관리
- **AI 표지 생성** : OpenAI API Key 입력 시 장르·스타일 기반 표지 자동 생성
- **로컬 이미지 업로드** : API Key 없이도 직접 이미지 파일로 표지 등록 가능
- **생성 취소** : 이미지 생성 중 취소 가능 (AbortController 사용)

---

## 화면 구성

| 화면 | 설명 |
|---|---|
| 홈 | 추천 도서 섹션 + 도서 목록 4열 그리드 |
| 도서 등록 | 좌측 표지 미리보기 / 우측 메타데이터 + OpenAI 설정 폼 |
| 마이페이지 | 좌측 도서 목록 / 우측 상세 정보 + 수정·삭제 버튼 |

---

## 프로젝트 구조

```
mini-project4-library/
├── db.json                        # 루트 DB (참고용)
└── walking-library/
    ├── db.json                    # json-server가 실제로 바라보는 DB
    ├── package.json
    └── src/
        ├── App.jsx                # 상태 관리, API 통신, 화면 라우팅
        └── components/
            ├── Header.jsx         # 네비게이션 + 검색 바
            ├── BookForm.jsx       # 도서 등록/수정 폼
            └── BookDetail.jsx     # 도서 상세 표시 (홈/마이페이지 겸용)
```

---

## 도서 데이터 구조

```json
{
  "id": 1,
  "title": "책 제목",
  "author": "작가 이름",
  "content": "줄거리",
  "genre": "소설",
  "style": "미니멀",
  "coverImageUrl": "data:image/png;base64,...",
  "imageModel": "gpt-image-2",
  "imageSize": "1024x1536",
  "imageQuality": "low",
  "outputFormat": "png",
  "createdAt": "2026-05-01T00:00:00.000Z",
  "updatedAt": "2026-05-01T00:00:00.000Z"
}
```

---

## 실행 방법

> 터미널을 두 개 열어 모두 `walking-library/` 폴더 안에서 실행합니다.

**1단계 — 의존성 설치** (최초 1회)

```powershell
cd walking-library
npm install
```

**2단계 — DB 서버 실행** (터미널 1)

```powershell
cd walking-library
npx json-server --watch db.json
```

→ `http://localhost:3000/books` 에서 API 서빙

**3단계 — React 앱 실행** (터미널 2)

```powershell
cd walking-library
npm run dev
```

→ `http://localhost:5173` 에서 앱 실행

---

## AI 표지 생성 사용 방법

1. 상단 메뉴에서 **도서 등록**으로 이동합니다.
2. 제목, 작가 이름, 줄거리를 입력합니다.
3. OpenAI API Key를 입력하고 모델·크기·품질·장르·스타일을 선택합니다.
4. **표지 이미지 미리보기 생성** 버튼을 클릭합니다.
5. 생성된 표지를 확인 후 **최종 등록** 버튼으로 저장합니다.

> API Key를 입력하지 않으면 표지를 생성할 수 없습니다.  
> API Key는 코드에 저장되지 않으며, 생성 요청 시 OpenAI API 비용이 발생할 수 있습니다.

### 지원 옵션

| 항목 | 선택지 |
|---|---|
| 이미지 모델 | `gpt-image-2`, `dall-e-3`, `dall-e-2` |
| 이미지 크기 | `1024x1536` (세로형), `1024x1024` (정사각형), `1792x1024` (가로형) |
| 이미지 품질 | `low` (빠른 생성), `medium` (일반), `high` (고화질) |
| 파일 형식 | `png`, `jpg`, `webp` |
| 도서 장르 | 실용서적, 소설, 시/에세이, 인문학, 판타지/SF |
| 표지 스타일 | 미니멀, 일러스트, 수채화, 사이버펑크, 클래식 |
