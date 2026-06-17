# claude-agent-tester

## 머지 정책
- **Rebase merge만 허용**한다. (Merge commit / Squash merge 비활성화)
- rebase merge는 PR의 모든 커밋을 그대로 base 브랜치에 올리므로, PR에 포함된
  **모든 커밋 메시지**가 아래 커밋 컨벤션을 만족해야 한다.

## 커밋 메시지 컨벤션 (Angular)

형식:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type** (필수): `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- **scope** (선택): 변경 범위 (예: `auth`, `api`)
- **subject** (필수): 명령형 현재시제, 마침표로 끝내지 않음
- 헤더(type+scope+subject)는 **72자 이내**
- Breaking change는 footer에 `BREAKING CHANGE:` 로 명시

예시:

- `feat(auth): add JWT refresh token rotation`
- `fix(api): handle null response from upstream`
- `docs: update README installation steps`

> 실제 검증 규칙의 원천은 `commitlint.config.js`(@commitlint/config-angular)이며,
> CI의 "Commit Lint (Angular)" 체크가 이를 강제한다.

## 리뷰
- PR별 상세 리뷰 기준은 [REVIEW.md](REVIEW.md) 참고.
