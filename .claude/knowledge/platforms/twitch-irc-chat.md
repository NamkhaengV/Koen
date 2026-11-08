---
title: Twitch IRC (tmi.js) — emote index, badge, gift event quirks
area: platforms
scope: chat
platform: twitch
sources:
  - legacy:pages/(CHAT)/chat.vue
updated: 2026-11-08
---

## What
tmi.js ต่อ IRC แบบ anonymous ได้ (ไม่ต้อง token) และได้ chat + `subscription`, `resub`, `subgift`,
`submysterygift`, `raided`, `cheer`. **ไม่มี follow** — ต้องใช้ EventSub ([[twitch-eventsub-websocket]]).

## Why
Anonymous IRC คือเหตุที่ chat widget ไม่ต้องมี backend หรือ token เลย. ข้อมูลที่ IRC ให้มีรูปแบบที่
ดูเหมือนตรงไปตรงมาแต่มีกับดักหลายจุด ด้านล่าง.

## Where it shows up
- `legacy:pages/(CHAT)/chat.vue:365` — `new tmi.Client({ channels: [channel] })` anonymous
- `legacy:pages/(CHAT)/chat.vue:377`, `:460` — reconnect เอง 5s หลัง disconnect / 10s หลัง connect fail

## Gotchas
- **XSS ใน legacy**: `parseEmotes` escape ข้อความเฉพาะตอน *ไม่มี* emote. ถ้ามี emote, ข้อความส่วนที่เหลือ
  ถูกต่อดิบๆ (`legacy:pages/(CHAT)/chat.vue:162`) แล้ว render ด้วย `v-html` (`:794`) —
  คนดูพิมพ์ HTML + emote หนึ่งตัว = inject เข้า OBS ของ streamer ได้. ต้อง escape ทุกช่วงที่ไม่ใช่ emote
- **Emote position เป็น code point ไม่ใช่ UTF-16** — `message.slice(start, end+1)` (`:164`) เลื่อนเมื่อมี
  emoji (surrogate pair) อยู่หน้า emote. ต้องแปลง string เป็น `Array.from(message)` ก่อนตัด
- **Mystery gift ส่ง event ซ้ำ**: `submysterygift` (1 ครั้ง, มีจำนวน) ตามด้วย `subgift` อีก N ครั้งสำหรับ
  ผู้รับแต่ละคน. Legacy push alert ทั้งสองแบบ (`:419`, `:429`) → gift 10 sub ได้ 11 alert.
  ต้อง suppress `subgift` ที่ตามหลัง mystery gift ของผู้ให้คนเดียวกัน
- `badges.subscriber` คือ **version ของ badge** (tier prefix `2xxx`/`3xxx` + ขั้น badge ที่ช่องตั้งไว้)
  ไม่ใช่จำนวนเดือนจริง. เดือนจริงอยู่ใน tag `badge-info` (`subscriber/<months>`). Legacy ใช้ `% 1000` กับ
  `badges` (`:184`) — ได้ขั้น badge ไม่ใช่เดือน และ comment บอกว่า "value > 1000 = tier 2/3" ซึ่งคลาดเคลื่อน
- `display-name` อาจว่าง หรือเป็นอักษรไทย/ญี่ปุ่นที่ต่างจาก login — fallback เป็น `username` เสมอ
