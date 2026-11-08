---
title: Config อยู่ใน DB ผูกกับ UUID — ห้ามเก็บใน URL หรือ localStorage
area: decisions
scope: core
platform: none
sources:
  - PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
Overlay URL มีแค่ `/overlay/<widget>/<uuid>`. Config ทุกค่า (สี, font, layout, custom badge) อยู่ใน
`widgets.config` (jsonb). รูปที่อัปโหลดเก็บใน Storage แล้วเก็บแค่ URL ใน config — ไม่ใช่ base64.

## Why
มาจากปัญหาของโปรเจคเก่า "レイヱン ChatWidget" สามข้อ:
1. **localStorage ของ OBS แยกจาก Chrome** — ผู้ใช้ตั้ง custom badge/token ใน Chrome แล้วเซฟลง localStorage
   แต่ Browser Source ใน OBS มี storage ของตัวเอง ค่าไม่ไปถึง overlay
2. **Config ใน query string** ยาวจนเจอ HTTP 431 และผู้ใช้ต้อง copy ลิงก์ใหม่ทุกครั้งที่แก้
3. ลิงก์คงที่ = realtime update ได้ — แก้ใน editor แล้ว OBS เปลี่ยนตามโดยไม่ต้องแปะลิงก์ใหม่

## Where it shows up
- `PROJECT_CONCEPT.md:70-71` — กฎ config ใน DB / รูปเป็น URL
- `PROJECT_CONCEPT.md:194-195` — บทเรียนต้นทาง
- `PROJECT_CONCEPT.md:155` — localStorage ใช้ได้ **เฉพาะฝั่ง dashboard** (badge "มีอัปเดตใหม่") เพราะเปิดใน browser ปกติ

## Gotchas
- อะไรที่ overlay ต้องใช้ ห้ามพึ่ง localStorage/cookie — ทดสอบใน Chrome ผ่าน แต่ใน OBS พัง
- base64 ใน jsonb ทำให้ row บวม + payload Broadcast ใหญ่ ([[overlay-public-access]])
- UUID คือ "secret link" — ใครได้ลิงก์ก็อ่าน config ได้ ห้ามใส่ secret ใน config ([[tokens-server-only]])
