---
title: schema_version + migrateConfig — overlay ที่แปะใน OBS อยู่ตลอดไป
area: technical
scope: core
platform: none
sources:
  - PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
ทุก row ใน `widgets` มี `schema_version`. เปลี่ยน shape ของ `config` เมื่อไหร่ → bump version
และเพิ่มขั้นใน `migrateConfig(old → new)` ที่ overlay เรียกก่อน apply.

## Why
ลิงก์ overlay ถูกแปะใน OBS ของผู้ใช้แล้วไม่มีใครกลับไปดู — ไม่มีโอกาสบอกให้ผู้ใช้ตั้งค่าใหม่.
Config เก่าใน DB ต้อง render ได้กับโค้ดใหม่เสมอ ไม่งั้นสตรีมของเขาพังกลางไลฟ์.

## Where it shows up
- `PROJECT_CONCEPT.md:117` — column
- `PROJECT_CONCEPT.md:98` — RPC คืน `schema_version` ให้ overlay
- `PROJECT_CONCEPT.md:156` — กฎ migrate

## Gotchas
- jsonb ไม่บังคับ schema — field ใหม่ต้องมี default ฝั่งโค้ด ห้ามสมมติว่ามีค่า
- Changelog tag `breaking` ควรคู่กับ bump `schema_version` เสมอ

Related: [[overlay-public-access]]
