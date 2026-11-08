---
title: คำศัพท์ — widget, editor, overlay, preview, alert
area: business
scope: both
sources:
  - .claude/PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
- **widget** — หนึ่ง row ใน `widgets`; มี `type` (`chat` | `notification` | `text` | `clock` | `info`).
  ผู้ใช้หนึ่งคนมีได้หลายตัว แม้ type เดียวกัน
- **editor** — `/dashboard/<type>/[id]` หน้าที่ต้อง login ใช้แก้ config
- **overlay** — `/overlay/<type>/[id]` หน้าโปร่งใส ไม่มี UI ที่ OBS เปิดเป็น Browser Source
- **OBS URL / secret link** — URL ของ overlay; UUID เดาไม่ได้ใช้แทนการ login
- **preview** — render ใน editor ด้วย **mock feed** + พื้นหลังจำลอง ไม่ต่อ Twitch จริง
- **alert** — event พิเศษ (sub / resub / gift / raid / bits / follow) ต่างจาก chat message ธรรมดา;
  follow มาทาง EventSub ฝั่ง server เท่านั้น ที่เหลือมาจาก IRC ได้

## Why
ผู้ใช้เป้าหมายคือสตรีมเมอร์ทั่วไป ไม่ใช่เจ้าของโปรเจคคนเดียว (`.claude/PROJECT_CONCEPT.md:13`)
→ เหตุที่ต้องมีบัญชี, RLS, และ preview ที่ใช้ได้โดยไม่ต้องไลฟ์

## Gotchas
- Preview กับ overlay ควรใช้ component render ตัวเดียวกัน ต่างแค่แหล่ง feed (mock vs `ChatSource`)
  ไม่งั้น preview ไม่ตรงของจริง
- `ChatSource` interface มีไว้เผื่อ YouTube (`.claude/PROJECT_CONCEPT.md:181-188`) — อย่าให้ component เรียก tmi.js ตรง

Related: [[config-in-db-not-url]], [[theme-css-variables]]
