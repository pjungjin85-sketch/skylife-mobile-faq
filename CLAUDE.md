# skylife-mobile-faq 프로젝트 규칙

공통 규칙은 상위 디렉토리 `/Users/jaypark/workspace/CLAUDE.md` 참고.

## 이 페이지 정보
- **용도**: 스카이라이프 모바일 FAQ (고객 응대용)
- **파일**: `index.html` (단일 파일)
- **GitHub Pages URL**: https://pjungjin85-sketch.github.io/skylife-mobile-faq/

## 기능 구조
- 카테고리별 FAQ 아코디언 (클릭 시 답변 펼침)
- 검색 기능 (질문/답변 전체 검색)
- 아코디언은 `<details>`/`<summary>` 또는 클래스 토글 방식

## 수정 시 주의사항
- FAQ 데이터 추가 시 기존 카테고리 구조 유지할 것
- 모바일에서 아코디언 탭 영역 최소 44px 유지 (터치 타겟)

## 기준월 자동 표시 (2026-10~)
- `data/faq.json`은 월별 키 구조: `{"YYYY-MM": {"FAQ_DATA": [...], "FRAUD_DATA": [...]}}`
- 페이지는 오늘 날짜 이하인 가장 최근 키를 골라 그 데이터를 보여주고, "YYYY년 M월 기준"을 자동 표시
- 자료 갱신 시 **새 월 키를 추가**하고 기존 월은 남겨둘 것 (미래 월 키는 해당 월이 되면 자동 적용)

## FAQ 추가 규칙

- 새 FAQ는 `data/faq.json` 의 `FAQ_DATA` **맨 뒤에** 추가할 것 (화면은 카테고리로 묶여 보이므로 위치 무관).
  업무지원 봇 KB 의 FAQ id(faq-001…)가 순서 기반이라, 중간에 넣으면 뒤 항목 id가 전부 밀려
  봇 검색 테스트와 질문 로그의 근거 id가 틀어진다.
