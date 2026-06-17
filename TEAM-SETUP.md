# 팀 레포 세팅 메모 (프롬프트용)

아래 블록을 팀 레포에서 Claude Code 에이전트에게 그대로 붙여넣으면, 이 레포에서 겪은
시행착오 없이 "Claude PR 리뷰어 + Angular 커밋 게이트 + rebase 머지"가 세팅된다.
`<owner>/<repo>` 만 팀 레포 정보로 바꿀 것.

---

```
# 목표: 이 레포에 "Claude PR 리뷰어 + Angular 커밋 게이트 + rebase 머지" 세팅

다음을 설정해줘. 아래 ⚠️ 함정들은 실제로 겪은 것이니 반드시 지킬 것.

## 요구사항
1. 머지 정책: rebase merge만 허용 (squash/merge commit 비활성, 머지 후 브랜치 삭제)
   → gh api -X PATCH repos/<owner>/<repo> -F allow_merge_commit=false -F allow_squash_merge=false -F allow_rebase_merge=true -F delete_branch_on_merge=true
2. 모든 커밋을 Angular 컨벤션으로 검사 (rebase는 커밋을 보존하므로 PR 내 전 커밋 검사 필요)
3. Claude가 PR마다 인라인 코멘트로 코드 리뷰

## 인증
/install-github-app 실행해 Claude GitHub App 설치 + 시크릿 등록.
구독 방식이면 시크릿은 CLAUDE_CODE_OAUTH_TOKEN(input: claude_code_oauth_token),
API 키 방식이면 ANTHROPIC_API_KEY(input: anthropic_api_key). 실제 등록된 것을 사용.

## ⚠️ 반드시 지킬 함정 3가지
1. /code-review 플러그인 템플릿을 쓰지 말 것 — anthropics/claude-code-action#1087 버그로
   인라인 코멘트가 0개("No buffered inline comments")가 됨. 반드시 직접 프롬프트 +
   네이티브 도구(mcp__github_inline_comment__create_inline_comment) 방식으로 작성.
2. 리뷰 워크플로 파일은 default 브랜치(main)와 100% 동일해야 Claude App 토큰이 발급됨
   (401 Workflow validation). → 리뷰 워크플로 수정은 항상 PR로 main에 먼저 머지한 뒤 테스트.
   같은 PR에서 워크플로를 바꾸면 그 PR에선 검증 실패.
3. 머지 차단(branch protection/ruleset)은 무료 private 레포에서 불가(403 Upgrade to Pro/public).
   팀이면 org + Team 플랜에서 org ruleset으로 commitlint를 required check로 걸 것.
   (개인 Pro 또는 public도 가능)

## 파일

commitlint.config.js
    module.exports = { extends: ['@commitlint/config-angular'] };
허용 type: build, ci, docs, feat, fix, perf, refactor, revert, style, test

.github/workflows/commitlint.yml
    name: Commit Lint (Angular)
    on: { pull_request: { types: [opened, synchronize, reopened] } }
    permissions: { contents: read }
    jobs:
      commitlint:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with: { fetch-depth: 0 }
          - uses: actions/setup-node@v4
            with: { node-version: 20 }
          - run: npm install --no-save @commitlint/cli @commitlint/config-angular
          - run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose

.github/workflows/claude-code-review.yml   ← 함정#1 회피한 핵심 버전
    name: Claude Code Review
    on: { pull_request: { types: [opened, synchronize, ready_for_review, reopened] } }
    jobs:
      claude-review:
        runs-on: ubuntu-latest
        permissions: { contents: read, pull-requests: write, id-token: write }
        steps:
          - uses: actions/checkout@v4
            with: { fetch-depth: 0 }
          - uses: anthropics/claude-code-action@v1
            with:
              claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
              prompt: |
                PR #${{ github.event.pull_request.number }} 를 한국어로 코드 리뷰하라.
                루트의 CLAUDE.md, REVIEW.md 규칙을 따른다.
                로직 버그/보안(injection,eval,인증,시크릿)/성능을 점검하고,
                발견한 각 이슈는 반드시 mcp__github_inline_comment__create_inline_comment
                도구로 해당 파일·라인에 인라인 코멘트를 남겨라.
                심각도 🔴(버그/보안)·🟡(스타일), 가능하면 수정 제안 포함, 마지막에 요약.
                이슈 없으면 "LGTM" 요약만.
              claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment,Read,Grep,Glob,Bash(gh:*),Bash(git:*)" --max-turns 25'

CLAUDE.md / REVIEW.md: 커밋 컨벤션과 리뷰 기준을 적어둘 것 (리뷰 봇이 읽음. 기준 변경 시 이 파일만 고치면 됨).

## 검증
잘못된 커밋 메시지 + 버그 코드(예: eval, off-by-one)가 있는 테스트 PR을 만들어
commitlint FAIL + Claude 인라인 코멘트가 실제로 달리는지 확인하고, 테스트 PR은 닫아라.
```
