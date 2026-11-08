---
title: Twitch token / service key อยู่ฝั่ง server เท่านั้น
area: decisions
scope: backend
sources:
  - .claude/PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
Token ของ provider (Twitch EventSub) เก็บในตาราง `provider_tokens` ที่ **เปิด RLS แต่ไม่มี policy** —
client เข้าไม่ได้เลย อ่านได้เฉพาะ `SUPABASE_SERVICE_KEY` ใน server routes / worker.
Chat ใช้ `tmi.js` แบบ anonymous จึงไม่ต้องมี token ใน overlay.

## Why
โปรเจคเก่าใช้ OAuth implicit grant — token อยู่ใน browser, ไม่มี refresh token, หมดอายุแล้ว alert ตาย
และ token ไปไม่ถึง OBS อยู่ดี ([[config-in-db-not-url]]). ย้ายไป server + refresh token แก้ทั้งสองอย่าง.

## Where it shows up
- `.claude/PROJECT_CONCEPT.md:121-126` — `provider_tokens` + เหตุผล RLS ไม่มี policy
- `.claude/PROJECT_CONCEPT.md:140` — service key ห้ามขึ้น client
- `.claude/PROJECT_CONCEPT.md:196` — บทเรียนต้นทาง

## Gotchas
- "RLS on + ไม่มี policy" คือ deny-all ตั้งใจ — อย่าเพิ่ม policy เพื่อ "ให้ใช้งานได้"
- ใน Nuxt ค่าใต้ `runtimeConfig.public` ขึ้น client — service key ต้องอยู่ private เท่านั้น
- EventSub / YouTube ต้องมี process รันค้าง → serverless route ไม่พอ ต้องมี worker แยก (`.claude/PROJECT_CONCEPT.md:148`)
