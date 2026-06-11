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
