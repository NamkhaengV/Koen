---
title: Theme token เป็น CSS variables — site กับ overlay ต้องแยกกัน
area: ui
scope: core
platform: none
sources:
  - app/assets/css/main.css
  - app/layouts/default.vue
  - nuxt.config.ts
  - legacy:composables/useOverlaySettings.ts
  - PROJECT_CONCEPT.md#3
updated: 2026-11-08
---

## What
Theme ของ site (สี primary Light Sky Blue `#87cefa`, surface, text, radius, shadow, font Krub) เป็น
CSS variables บน `:root` ใน `app/assets/css/main.css`. Component ใช้ผ่าน `var(--color-…)`.
`body` ตั้งใจ **ไม่มี background** — พื้นหลังของ site ใส่ที่ layout (`.root-layout`) แทน.

## Why
- Overlay ทำงานใน OBS Browser Source ต้องโปร่งใส ถ้า `html`/`body` มีสีจะทับ scene
  ([[obs-browser-source]]). เลยย้ายพื้นหลังไปอยู่ใน layout ของ site
- CSS variables เป็น theme API ที่โปรเจคเก่าทำแล้วเวิร์ก (`PROJECT_CONCEPT.md:199`) —
  เปลี่ยนค่าตอน runtime ได้โดยไม่ต้อง re-render; Tailwind class สร้างตอน build เลยรับค่าสีที่ผู้ใช้เลือกไม่ได้
- Krub มีอักษรไทยในตัว จึงไม่มี font ไทยสำรองใน stack (ตัดสินใจ 2026-11-08)

## Where it shows up
- `app/assets/css/main.css:9` — token ทั้งหมดบน `:root`
- `app/assets/css/main.css:46` — comment + `body` ไม่มี background
- `app/layouts/default.vue:22` — `background-color: var(--color-bg)` ใส่ที่ layout
- `nuxt.config.ts:14` — โหลด Krub จาก Google Fonts
- `legacy:composables/useOverlaySettings.ts:218` — `applyCssVars` เขียน var ของ widget ลง `document.documentElement`

## Gotchas
- **Token อยู่ใน `:root` ไม่ใช่ `@theme`** → Tailwind ไม่สร้าง class อย่าง `bg-primary` ให้.
  ใช้ได้แค่ `var(--color-primary)` หรือ arbitrary value `bg-(--color-primary)`
- `app/components/layout/Sidebar.vue:8` ใช้ `border-gray-200` (สี default ของ Tailwind) แทน `--color-border`
  — สีจะไม่ตาม theme ถ้าเปลี่ยน token
- **ยังมีแค่ layout `default`** ซึ่งมี sidebar + พื้นหลัง. หน้า overlay ต้องใช้ layout ว่างแยก
  (`definePageMeta({ layout: … })`) ไม่งั้น OBS เห็น sidebar และพื้นสีทึบ
- Legacy เขียน var ของ widget (`--bubble-bg`, `--text-color`, …) ลง `:root` — ใน hub ที่หน้า settings มี
  live preview อยู่ในหน้าเดียวกับ site UI, var ของ widget จะชนกับ token ของ site.
  ตั้ง var ของ widget บน element root ของ widget แทน และตั้งชื่อมี prefix ของ tool
- `#87cefa` สว่างเกินสำหรับตัวหนังสือขาว (contrast ~1.7:1) — `app/assets/css/main.css:4` อธิบายแล้วว่าใช้ `--color-on-primary`

Related: [[widget-overlay-model]], [[obs-browser-source]]
