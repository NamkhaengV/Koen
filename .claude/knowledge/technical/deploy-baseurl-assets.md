---
title: baseURL กับ static asset — badge หายตอน deploy
area: technical
scope: site
platform: none
sources:
  - legacy:nuxt.config.ts
  - legacy:composables/useOverlaySettings.ts
updated: 2026-11-08
---

## What
ถ้า deploy ใต้ sub-path (เช่น GitHub Pages `/<repo>/`) ต้องตั้ง `app.baseURL` และ **ทุก path ของ
asset ที่สร้างใน JS** ต้อง prefix ด้วย `useNuxtApp().$config.app.baseURL`. Path ที่เขียนใน template
ผ่าน Nuxt ได้ prefix อัตโนมัติ แต่ string ใน TS (`'/badges/x.svg'`) ไม่ได้.

## Why
Legacy เก็บ default badge เป็น const `'/badges/broadcaster.svg'` — dev ทำงาน, deploy ขึ้น
`/stream-chat-demo/` แล้ว 404 ทุกรูป. ใช้ 3 commit (`1de93e28`, `f2b58753`, `51004ad4`,
2026-04-15 ถึง 2026-04-16) กว่าจะแก้เป็นฟังก์ชัน `getDefaultBadgeImages()` ที่ prefix ตอน runtime.

## Where it shows up
- `legacy:nuxt.config.ts:8` — `baseURL: '/stream-chat-demo/'`
- `legacy:composables/useOverlaySettings.ts:111` — `getDefaultBadgeImages()` คือตัวแก้

## Gotchas
- Default badge path **ห้าม** encode ลง URL หรือเก็บใน config — ถ้า baseURL / host เปลี่ยน, URL ที่ผู้ใช้แปะ
  ใน OBS ไว้แล้วจะชี้ path ผิดตลอดไป. เก็บแค่ key (`broadcaster`) แล้ว resolve ตอน runtime
- `PROJECT_CONCEPT.md#3` เลือก host ที่มี server routes (ไม่ใช่ GitHub Pages) → ถ้าทางนั้นชนะ
  ปัญหานี้หายไป แต่ถ้ากลับไป static SPA บน GitHub Pages ต้องเจอแน่ ([[config-in-db-not-url]])
