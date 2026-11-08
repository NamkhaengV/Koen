---
name: report
description: Show a git commit message (/report git), show a Discord work report in Markdown (/report discord or /report dc), or write the message and actually commit (/report commit). Use when the user runs /report, or asks for a commit message, to commit their changes, or for a work report/update for Discord.
argument-hint: "git | commit | discord | dc  [feat|fix|update|refactor|style|perf|docs|test|chore] [th|en] [ช่วงเวลา หรือ note]"
---

# /report — commit message & Discord work report

Usage:

```
/report git                    → แสดง commit title + description (ไม่ commit)
/report discord   (or dc)      → แสดง Discord work report
/report commit                 → เขียน commit message แล้ว commit ขึ้น git เลย
/report dc since monday        → report covering a period
/report git feat               → force commit type Feat
/report commit fix login bug   → commit with type Fix + hint "login bug"
/report git feat en            → commit message in English
/report dc en                  → Discord report in English
```

**Only `/report commit` changes the repository.** `git` and `discord` just display text —
no `git add`, no `git commit`.

Arguments: $ARGUMENTS

## Pick the action from the first argument

| First argument (case-insensitive) | Action | Touches the repo? |
|---|---|---|
| `git` | **Show** a commit message — see *Commit format* | no |
| `discord`, `dc` | **Show** a Discord report — see *Discord report format* | no |
| `commit` | Write the commit message, then **commit** — see *Committing* | yes |
| empty or anything else | ask in one line: `git`, `commit` หรือ `discord`? | — |

For `git`, after the message add a short list of the files it covers and one closing line:
`ใช้ /report commit เพื่อ commit จริง`.

## Language

Any argument equal to a language code sets the output language and is removed from the hint.
**Default is Thai** for both outputs.

| Argument | Language |
|---|---|
| (none), `th`, `thai`, `ไทย` | Thai |
| `en`, `eng`, `english` | English |

Applies to both outputs. Regardless of language, these stay in English exactly as written:
- the commit type prefix (`Feat:`, `Fix:` …) and the report header tag (`[UPDATE]`, `[FIX]`)
- section headings **Backend** / **Frontend** / **Others**
- code identifiers, field names, endpoints, library names, and technical terms the team writes
  in English (API, CRUD, soft delete, component, endpoint, pagination …)
- module names the project itself writes in English (`Chatroom`, `Card Form`)

Thai output = Thai sentence structure with those English terms embedded, the way the team
already writes ("ปรับ Card Form ให้ scroll เฉพาะในส่วนของ card"). Do not translate technical
terms into Thai words nobody uses.

For `git` and `commit`, any argument that is a commit type sets the type of the title and is
removed from the hint:

| Argument | Title type | Use for |
|---|---|---|
| `feat` | `Feat` | new feature / page / endpoint |
| `fix` | `Fix` | bug fix |
| `update` | `Update` | change to existing behaviour or UI |
| `refactor` | `Refactor` | restructure without behaviour change |
| `style` | `Style` | formatting / lint only |
| `perf` | `Perf` | performance |
| `docs` | `Docs` | documentation only |
| `test` | `Test` | tests only |
| `chore` | `Chore` | config, dependencies, build, tooling |

- Type given → use it as-is, even if the diff looks like another type. If the diff clearly
  contradicts it (e.g. `fix` but the diff only adds a new page), still use the user's type but
  add one line after the message: `หมายเหตุ: diff ดูเป็น <type> มากกว่า`.
- Type not given → infer it from the diff using the same table.
- For `refactor`, `style`, `chore`, `docs`, `test` the change *is* the non-feature work, so
  rule 2 (main features only) is relaxed: describe that work, still briefly.

Everything else after the first argument (minus the type and language, if any) is a hint: a time range (`today`, `since monday`,
`2026-11-01..2026-11-08`) or the user's own notes about what to emphasise. Use it to pick the
commit range and to name modules, but every bullet still has to be backed by the diff.

Defaults when no range is given:
- `git` / `commit` → uncommitted changes (`git diff HEAD`); if there are none, the staged changes; if
  still none, say there is nothing to commit.
- `discord` → today's commits by the current git user (`git log --since=midnight
  --author="$(git config user.name)"`) plus any uncommitted work.

Produce **only** the requested output — never both.

## Core rules (both outputs)

1. **Short.** One bullet = one change, one line. No explanations of *how* it was coded.
2. **Main features only.** Skip refactors, lint/format, renames, typo fixes, dependency bumps,
   and config tweaks — unless that is the *only* thing in the change.
3. **Name the module** in every group or bullet (`Chatroom`, `Master data`, `บทบาทและสิทธิ์`).
   Use the name the project/team uses (page title, route, folder) — not the file name.
4. **Backend: always list endpoints** that were added or changed, as
   `` `METHOD /path` ``. Group CRUD on one resource into one line instead of five.
5. Never invent work. Every bullet must trace back to the diff or to something the user said.

## Step 1 — find what changed

Run what applies (skip silently if not a git repo — then work from what the user describes):

```bash
git status --short
git diff --stat HEAD            # uncommitted work → for a commit
git diff HEAD                   # read the actual changes
git log --oneline -20           # learn this repo's commit style first
```

For a report covering a period:

```bash
git log --since="<date>" --author="<name>" --pretty="%h %s" --stat
```

If the repo has both backend and frontend (or several repos), check each.

To find endpoints in the diff, grep added lines for route definitions, e.g.
`@router.(get|post|put|patch|delete)`, `app.(get|post|...)`, `@(Get|Post|...)Mapping`,
`server/api/**` file paths — whatever the project's framework uses.

## Step 2 — group by module

Bucket every meaningful change under a module. Drop anything that fails rule 2. If a module
ends with only trivial items, drop the module.

## Commit format

```
<Type>: <Module> - <main change>

- <change>
- <change>
```

- **Type:** from the second argument, or inferred — see the type table above. Write it
  capitalised (`Feat`, `Fix`, …) unless the repo's `git log` consistently uses another casing
  (`feat:`), in which case match the repo.
- **Title:** ≤ 72 characters, no trailing period. Module is mandatory; the `- <main change>`
  part is optional when the module name says enough (`Feat: Chatroom`).
- **Title text after the type** follows the chosen language; the module name stays as the
  project writes it.
- **Description:** 2–6 bullets, no period. English: lowercase start, imperative or noun
  phrase. Thai: short verb phrase (เพิ่ม / แก้ / ปรับ / ลบ …).
- Backend endpoints go in their own bullet(s) with the method.
- **Do not start any line with `#`** — git treats it as a comment and deletes it when the
  message is written in an editor. The title is plain text.
- One commit = one main topic. If the diff covers unrelated modules, suggest splitting into
  separate commits and give a message for each.

### Example — frontend (ไทย, default)

```
Feat: Chatroom

- mock ข้อมูล chats, messages, users
- เพิ่ม dropdown menu component
- หน้า UI ติดตาม chatroom
```

### Example — backend (ไทย)

```
Feat: Master Data - CRUD API พร้อมค้นหาและแบ่งหน้า

- `GET|POST /api/master-data/documents`, `GET|PUT|DELETE /api/master-data/documents/{id}`
- CRUD ชุดเดียวกันสำหรับ criteria, majors, universities
- soft delete ด้วย `deleted_at`
```

### Example — fix (ไทย)

```
Fix: Card Form - scroll เฉพาะในส่วนของ card
```

### Example — English (`/report git feat en`)

```
Feat: Chatroom

- mock chats, messages, users
- dropdown menu component
- chatroom follow UI
```

## Committing (`/report commit` only)

Only after the message is written and checked.

1. **Decide what goes in the commit**
   - Something is already staged (`git diff --cached --quiet` fails) → commit **only the
     staged changes**; do not stage anything else. Write the message from
     `git diff --cached`, not from the whole working tree.
   - Nothing staged → stage all changes with `git add -A`, **except** files that look like
     secrets or local junk: `.env*` (but not `.env.example`), `*.pem`, `*.key`,
     `credentials*`, `*.log`, `.DS_Store`, build output (`.output/`, `dist/`, `.nuxt/`).
     If any of those show up in `git status`, leave them unstaged and say so in one line.
   - Nothing to commit at all → say so and stop.
2. **Split check** — if the message rules above say the diff should be several commits, do
   not commit; show the proposed split and ask which to commit first.
3. **Commit** with the message passed verbatim (keeps bullets and blank line intact):

   ```bash
   git commit -F - <<'MSG'
   <title>

   - <bullet>
   - <bullet>
   MSG
   ```

   Never use `--no-verify`, `--amend`, or `git push` unless the user asks.
4. **Hook failure** (lint/test pre-commit) → do not retry blindly. Show the error; if the hook
   reformatted files, re-stage those same files once and commit again; otherwise stop.
5. **Report back** in two lines: short hash + title (`git log -1 --pretty="%h %s"`) and the
   file count (`git show --stat --oneline -1 | tail -1`). Do not repeat the full message.

## Discord report format

```markdown
### [UPDATE] <ชื่อโปรเจค>
**Backend**
- **<Module>** — <สิ่งที่ทำ>
  - `METHOD /path` — <ทำอะไร>

**Frontend**
- **<Module>** — <สิ่งที่ทำ>
```

Rules:
- Header: `### [UPDATE] <ชื่อโปรเจค>` — use `[FIX]` if the report is only fixes,
  `[RELEASE]` for a deploy. Ask for the project name if it is not obvious from the repo.
- Sections in this order: **Backend**, **Frontend**, then optional **Others** (infra, docs).
  Omit an empty section — never print a heading with nothing under it, and never print one
  twice.
- Bullet = `**<Module>** — <ผลลัพธ์ที่ผู้ใช้/ทีมเห็น>`. Describe behaviour and business rules,
  not code ("ลบโครงการแล้ว Master data ยังอยู่", not "เพิ่ม on_delete=SET_NULL").
- Endpoints: sub-bullets under the module, in backticks with the method. More than ~4 for one
  module → summarise as "CRUD + ค้นหา + แบ่งหน้า" and list only the non-standard ones.
- Use ` — ` to separate the module/topic from the detail, ` / ` or `,` to join short related
  points. Keep to one level of sub-bullet.
- Short business rules a reader must know (constraints, what can't be edited, what is
  optional) belong in the report — that is its main value over the commit log.
- No intro/outro sentences, no emoji unless the user's past reports use them.
- With `en`, write the bullets in English; header tag and section headings are unchanged.
- Wrap the whole report in a ```markdown code block when replying, so it copies cleanly.

### Example

```markdown
### [UPDATE] ระบบทุนการศึกษา
**Backend**
- **Master data** — รายการเอกสาร, เกณฑ์การพิจารณา, สาขาวิชา, มหาวิทยาลัย: CRUD + ค้นหา + แบ่งหน้า, soft delete
  - `GET /api/master-data/{type}` — รายการพร้อมค้นหา/แบ่งหน้า
- **โครงการทุน** — เปิดใช้งานได้ทีละโครงการ, `year` และช่วงรับสมัครเป็น optional
  - `POST /api/projects` — สร้างโครงการพร้อม Master data ชื่อเดียวกัน (คัดลอกจากชุดเดิม หรือเริ่มว่าง)
  - `PATCH /api/projects/{id}/activate` — เปิดใช้งานโครงการ
- **Master data ที่ผูกโครงการ** — แก้ชื่อ/ลบไม่ได้ แต่แก้ข้อมูลด้านในได้ / ลบโครงการแล้ว Master data ยังอยู่

**Frontend**
- **บทบาทและสิทธิ์** — ปรับการแสดงผลชื่อและสีของบทบาท
- **Card Form** — scroll เฉพาะในส่วนของ card
- **รับและจัดการเอกสาร** — เอา export PDF ออก
```

## Before replying — check

- [ ] every bullet names a module
- [ ] every new/changed backend endpoint is listed with its method
- [ ] no refactor/lint/rename noise
- [ ] commit: no line starts with `#`, title ≤ 72 chars, type matches the argument or the diff
- [ ] language = the argument, or Thai if none; technical terms left in English
- [ ] `git` / `discord` → nothing staged or committed; `commit` → committed, no secrets staged, not pushed
- [ ] report: no empty or duplicated section, inside a ```markdown block
- [ ] nothing listed that is not in the diff or the user's description
