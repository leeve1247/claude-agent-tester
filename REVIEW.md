# PR Review Instructions

## 커밋 메시지 (최우선)
이 레포는 rebase merge만 허용한다. PR의 **모든 커밋**이 Angular 컨벤션을 따라야 한다.
- 검사 형식: `type(scope): subject`
- 허용 type: `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- 하나라도 위반하면 🔴 로 표시하고, 수정된 커밋 메시지 예시를 제안한다.

## 코드 리뷰
- 🔴 Important: 로직 버그, null/미초기화, 보안 취약점, 하드코딩된 시크릿, 인증/인가 우회
- 🟡 Nit: 네이밍, 스타일, 사소한 리팩터링
- Nit은 최대 5개까지만 보고하고, 나머지는 요약에 "외 N건"으로 적는다.

## 무시할 파일
- `*.lock`, 자동 생성 파일, `node_modules/`, `dist/`
