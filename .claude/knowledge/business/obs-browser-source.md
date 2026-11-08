---
title: OBS Browser Source — สตรีมเมอร์ใช้ overlay ยังไงจริงๆ
area: business
scope: core
platform: none
sources:
  - legacy:README.md
  - legacy:composables/useOverlaySettings.ts
  - PROJECT_CONCEPT.md#9
updated: 2026-11-08
---

## What
Overlay ถูกเปิดใน Browser Source ของ OBS (CEF) ไม่ใช่ browser ของผู้ใช้. สิ่งที่ legacy แนะนำให้ตั้ง:
- Custom CSS `body { background: transparent !important; overflow: hidden; }`
- ✅ **Shutdown source when not visible** — ซ่อน source = ปิดหน้า = ตัด IRC/EventSub
- ✅ **Refresh browser when scene becomes active** — สลับ scene กลับมา = โหลดหน้าใหม่ทั้งหมด
- Width ตามค่าใน settings (default 340), height ราว 700

## Why
- **CEF มี storage profile ของตัวเอง** — localStorage ที่ settings page เขียนใน Chrome ไม่ไปถึง OBS.
  นี่คือบทเรียนหลักของโปรเจคเก่า ([[config-in-db-not-url]])
- สองตัวเลือก shutdown/refresh ทำให้ overlay **เกิดใหม่บ่อยมาก** ระหว่างสตรีม → state ใน memory
  (feed, alert queue) หายทุกครั้ง และ connect ใหม่ทุกครั้ง

## Where it shows up
- `legacy:README.md:14-17` — ค่าที่แนะนำ
- `legacy:composables/useOverlaySettings.ts:17` — EventSub token เก็บใน localStorage แล้ว comment
  บอกว่า "OBS overlay โหลด credentials จาก localStorage โดยตรง" — **ใช้ไม่ได้จริงใน OBS** ด้วยเหตุผลข้างบน

## Gotchas
- **Legacy README ขัดกับโค้ด**: `legacy:README.md:32` บอกว่า settings save ใน localStorage แล้ว overlay
  apply ตอนโหลด แต่โค้ด overlay อ่านจาก URL (`legacy:composables/useOverlaySettings.ts:392`)
- ทดสอบใน Chrome ผ่าน ≠ ทำงานใน OBS. ต้องทดสอบใน Browser Source จริง หรืออย่างน้อยใน incognito
- Connect ใหม่ทุกครั้งที่สลับ scene → reconnect ต้องเร็วและไม่ spam API (Helix rate limit,
  EventSub subscription ซ้ำ — [[twitch-eventsub-websocket]])
