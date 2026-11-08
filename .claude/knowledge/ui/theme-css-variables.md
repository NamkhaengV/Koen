---
title: CSS variables คือ theme API ของ widget
area: ui
scope: frontend
sources:
  - .claude/PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
Overlay แปลง `config` เป็น CSS custom properties บน root ของ widget แล้ว component อ่านจาก var.
Tailwind ใช้กับ layout/dashboard; ค่าที่ผู้ใช้ปรับได้ต้องผ่าน var.
หน้า `/overlay/**` เป็น `ssr: false`, layout ว่าง, `body { background: transparent }`.

## Why
- โปรเจคเก่าทำแบบนี้แล้วเวิร์ก ตั้งใจเก็บไว้ (`.claude/PROJECT_CONCEPT.md:199`) — realtime update
  แค่เขียน var ใหม่ ไม่ต้อง re-render feed
- Tailwind สร้าง class ตอน build — class จากค่าที่ผู้ใช้เลือกตอน runtime (เช่น arbitrary color) ใช้ไม่ได้

## Where it shows up
- `.claude/PROJECT_CONCEPT.md:31` — stack
- `.claude/PROJECT_CONCEPT.md:52` — overlay route rules

## Gotchas
- Background ใดๆ ใน app root / layout ที่ไม่โปร่งใส จะทับ scene ใน OBS — overlay ต้องไม่มี background

Related: [[widget-overlay-model]]
