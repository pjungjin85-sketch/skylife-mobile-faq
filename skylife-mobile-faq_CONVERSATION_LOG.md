# skylife-mobile-faq 작업 로그

## 2026-06-11

### 작업 내용
- `<meta name="robots" content="noindex, nofollow">` 추가 (검색엔진 차단)
- fetch 에러 처리: `loadData()` named function + `!res.ok` 체크 + 다시 시도 버튼
- 브랜드 표기 통일: title·footer `KT 스카이라이프` → `kt skylife`
- footer 표기 통일: `Created by 박정진 | 모바일 FAQ`
- footer 스타일 통일 (FAQ 기준 — 이미 기준 파일): `position:fixed;bottom:0;padding:10px;color:#666666;z-index:50`

### 버그 수정 (코드 리뷰)
- `err.message` XSS: HTML 이스케이프 처리
- 탭 버튼·질문 버튼에 `type="button"` 속성 추가
- `data.FAQ_DATA` 구조 검증: `Array.isArray()` 방어 코드 추가
- `highlight()` 에스케이프 순서 개선: 원문에서 매치 위치 추출 후 조각별 escape → `<mark>` 삽입 방식으로 재작성 (HTML 엔티티 오하이라이트 방지)

---

## 2026-07-10

### 작업 내용

#### 인기 검색어 TOP 10 기능 추가
- `localStorage`에 검색 기록 누적 저장 (브라우저 닫아도 유지)
- 유사 키워드 통합: 20개 카테고리 동의어 맵 (`SYNONYMS_DEF`) — 예) `번이`, `번호이동방법` → `번호이동` 합산
- 처음엔 검색창 옆 `📊 TOP 10` 버튼 방식으로 구현

#### 레이아웃 변경: 버튼 → 우측 상단 상시 차트
- 버튼 제거, 우측 195px 고정 컬럼(`ranking-aside`)으로 항상 표시
- 900px 이하 화면에서 자동 숨김 (공간 확보)
- 막대 그래프 애니메이션 (`requestAnimationFrame` + CSS transition)
- 🥇🥈🥉 메달 아이콘, 4위부터 숫자
- 키워드 클릭 시 해당 키워드로 바로 검색 이동
- 초기화 버튼 포함

#### FAQ 클릭 카운팅 추가
- 검색 키워드 + FAQ 제목 클릭(열 때만) 통합 집계
- `recordFaqClick(title)`: 제목 첫 단어 기준으로 `SYNONYM_MAP` 정규화 후 저장
- 닫을 때는 카운팅 안 됨 (실제로 읽은 것만)
- 예) `번호이동` 검색 3회 + "번호이동시 인증항목" 클릭 2회 = 5회 합산

### 배포
- `jpjpjpjpjp21/skylife-mobile-faq` GitHub Pages 3회 배포 완료

---

## 2026-07-16 업데이트 — Supabase 프로젝트 마이그레이션
- 로그인 게이트(`profiles.status` 조회)가 참조하던 기존 Supabase 프로젝트가 90일 초과 일시정지로 복구 불가 확인 → 신규 프로젝트 `skylife-shared`(ref `qvzlwhwxspmofrwdvgdd`)로 URL/KEY 교체
- 상세 배경은 skylife-inquiry의 `skylife-inquiry_CONVERSATION_LOG.md` 참고 (워크스페이스 6개 사이트 공용 이슈였음)
- 이 커밋에는 이미 작업 중이던 로그인월(lock-overlay) 기능도 미커밋 상태로 함께 포함되어 같이 push/배포됨

---

## 2026-07-20 업데이트 — favicon 통일 (워크스페이스 6개 사이트 공용)
- 브라우저 탭에서 skylife-guide/TPS는 kt skylife 로고 favicon이 보이는데, 나머지 6개 사이트(skylife-plans, skylife-addons, skylife-commission-calculator, skylife-mobile-faq, mobile-manual, skylife-inquiry)는 favicon 링크 태그 자체가 없어 브라우저 기본(Vercel "V") 아이콘이 노출되던 문제
- skylife-guide/TPS에 있던 동일한 `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,...">` (kt skylife 빨간 로고 SVG)를 6개 파일 `<title>` 다음 줄에 그대로 추가
- 커밋: `b79296e` — kt skylife 로고 favicon 추가 (skylife-mobile-faq)
- 6개 프로젝트 전체 git push 완료. skylife-inquiry는 Vercel 수동 배포 필요해 `npx vercel deploy --prod` 추가 실행

---

## 2026-07-24 업데이트 — 부정가입장지 조치 내역 추가 + 인기검색어 전체집계 전환 + FAQ 2건 추가

### FRAUD_DATA(부정가입장지 조치 내역) 3건 추가
- `2026.07.07 / 과기부` — 안면인증 전면 도입 (안면인증 3회 실패시 스킵 가능)
- `2026.08.04 / KAIT` — 외국인 180일이내 1회선만 개통 가능 (외국인등록증, 여권등 모두 공통사항)
- note 필드에 `※`를 직접 넣었다가 렌더링 시 `index.html`이 자동으로 `※ `를 붙이는 걸 몰라 중복 발생 → note에서 `※` 제거해서 수정 (커밋 `1b53a73`)

### 인기검색어 TOP10: localStorage(브라우저별) → 전체 접속자 공통 집계로 전환
- 기존 방식은 사용자마다 랭킹이 다르게 보이는 문제가 있었음 (브라우저별 로컬 저장)
- Vercel Marketplace로 **Upstash Redis** 프로비저닝, `skylife-mobile-faq-um3h` Vercel 프로젝트에 연동
- `api/stats.js` 서버리스 함수 신규 추가 (GET 조회 / POST 카운트 증가 / DELETE 초기화, Redis sorted set 사용)
- `index.html`의 `STATS_API`가 `https://skylife-mobile-faq-um3h.vercel.app/api/stats` 절대 URL을 호출 (GitHub Pages는 정적 사이트라 Vercel API를 cross-origin으로 호출, CORS `*` 허용)
- "초기화" 버튼은 전체 데이터 삭제라 관리자 암호(`X-Admin-Key` 헤더, env var `ADMIN_RESET_KEY`) 확인 후에만 동작하도록 보호 추가
- 관리자 초기화 암호는 메모리 `reference_skylife_faq_ranking.md`에 기록
- 커밋: `3acaaca`

### FAQ 항목 추가/수정
- "외국인 가입 한도" 항목 최상단에 `[2026.08.04 시행/KAIT] 외국인 180일이내 1회선만 개통 가능` 규제 내용 반영 (커밋 `93f9d03`)
- "유심" 카테고리에 "듀얼심 명의불일치 정지" 항목 신규 추가 — 1대 단말기 2명의자 회선 인식 시 규제기관 정지 처리 로직 + eSIM 전환 시 KAIT 정보제공 미동의로 인한 오탐 케이스 안내 (커밋 `208fd4e`)
