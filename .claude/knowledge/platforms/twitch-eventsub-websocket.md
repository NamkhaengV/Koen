---
title: Twitch EventSub WebSocket — welcome, keepalive, reconnect
area: platforms
scope: notification
platform: twitch
sources:
  - legacy:pages/(CHAT)/chat.vue
  - PROJECT_CONCEPT.md#8
updated: 2026-11-08
---

## What
EventSub over WebSocket (`wss://eventsub.wss.twitch.tv/ws`) ทำงานแบบนี้:
1. เปิด socket → ได้ `session_welcome` พร้อม `session.id` และ `keepalive_timeout_seconds`
2. POST `/helix/eventsub/subscriptions` ด้วย `transport: { method: 'websocket', session_id }`
3. ได้ `session_keepalive` ทุกช่วงเวลา ถ้าเงียบเกิน timeout = socket ตาย
4. `session_reconnect` ให้ `reconnect_url` — subscription เดิม **ย้ายตามไปเอง** ไม่ต้อง subscribe ใหม่
5. `revocation` = subscription ถูกยกเลิก (token หมดอายุ / scope หาย / user ถอน auth)

Follow มีทางนี้ทางเดียว — IRC ไม่มี follow event เลย ([[twitch-irc-chat]]).

## Why
WebSocket transport ใช้ได้กับ **user access token** เท่านั้น (ไม่ใช่ app token) → overlay ที่ต่อ EventSub
ตรงจาก browser ต้องถือ token ของ streamer. นี่คือเหตุที่โปรเจคเก่าต้องเก็บ token ไว้ฝั่ง client
และเป็นต้นเหตุปัญหาใน [[tokens-server-only]].

`channel.follow` version `2` ต้องมี `moderator_user_id` + scope `moderator:read:followers` —
token ต้องเป็นของ broadcaster หรือ mod ของช่องนั้น.

## Where it shows up
- `legacy:pages/(CHAT)/chat.vue:615` — อ่าน `keepalive_timeout_seconds` (fallback 10) แล้วตั้ง watchdog +5s
- `legacy:pages/(CHAT)/chat.vue:548` — `channel.follow` version `2`
- `legacy:pages/(CHAT)/chat.vue:688` — `connectEventSubToUrl` จัดการ `session_reconnect`

## Gotchas
- **Subscribe ให้ทันหลัง welcome** — Twitch ปิด connection ที่ไม่มี subscription ภายใน ~10 วินาที
  (ตาม Twitch docs). Legacy ยิง Helix 2 ครั้ง (`/users?login=` และ `/users` ของเจ้าของ token,
  `legacy:pages/(CHAT)/chat.vue:627`, `:530`) ก่อน subscribe — ควร resolve user id ก่อนเปิด socket
- **Legacy จัดการ `session_reconnect` ผิด**: หลัง welcome บน URL ใหม่ message ถัดไปเรียก
  `connectEventSub(channel)` (`legacy:pages/(CHAT)/chat.vue:707-709`) ซึ่งเปิด socket ใหม่ที่ URL ปกติ
  และ subscribe ใหม่ — ทิ้งข้อดีของ reconnect_url และอาจพลาด event ช่วงสลับ. Comment บอกว่า "forward ไป handler ปกติ" แต่โค้ดไม่ได้ทำแบบนั้น
- Legacy reset watchdog เป็น 15s ตายตัวเมื่อได้ notification (`legacy:pages/(CHAT)/chat.vue:646`)
  แทนที่จะใช้ค่า timeout จาก welcome
- `revocation` ใน legacy แค่ตั้ง status error ไม่บอกผู้ใช้ว่าต้อง auth ใหม่ — alert หายเงียบกลางสตรีม
- Implicit-grant token ไม่มี refresh → หมดอายุแล้ว follow alert หยุดโดยไม่มีอะไรเตือน
