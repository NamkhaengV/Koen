---
title: typescript ต้องอยู่ใน devDependencies และ pin ที่ ~6.0
area: technical
scope: site
platform: none
sources:
  - package.json
  - .vscode/settings.json
updated: 2026-11-08
---

## What
`typescript` เป็น devDependency ที่ pin ไว้ `~6.0.3` — ห้ามถอดออก และห้ามอัปเป็น 6.1+ หรือ 7
จนกว่า `@typescript-eslint` จะรองรับ.

## Why
- `@nuxt/eslint` อ่าน `<script lang="ts">` เป็น TypeScript ได้ก็ต่อเมื่อมี package `typescript`.
  ถ้าไม่มี มันอ่านเป็น JavaScript แล้วตีความ `ref<boolean>(…)` เป็นเครื่องหมาย `<` `>` —
  เกิดจริงเมื่อ 2026-11-08 หลังล้างโปรเจคแล้วถอด `typescript` ออกไปด้วย
- `.vscode/settings.json` สั่ง `source.fixAll.eslint` ตอน save → ESLint "แก้" เป็น `ref < boolean > (…)`
  **โค้ดพังเงียบๆ ทุกครั้งที่ save** ไม่ใช่แค่ขึ้น error
- `@typescript-eslint/typescript-estree` รองรับ `typescript >=4.8.4 <6.1.0`.
  TypeScript 7 เป็น Go-native ไม่มี JS API ที่ `vue-tsc` / ESLint parser ใช้

## Where it shows up
- `package.json:33` — `"typescript": "~6.0.3"`
- `.vscode/settings.json:4` — fix ตอน save

## Gotchas
- หลังลง/อัป `typescript` ต้อง restart ESLint ใน VS Code (Ctrl+Shift+P → "ESLint: Restart ESLint Server")
  ไม่งั้น server ตัวเก่ายังอ่านเป็น JS และยังแก้โค้ดพังตอน save
- `pnpm up` / `pnpm add typescript@latest` จะดึง 7 มา — ใช้ `~` เพื่อกันไว้
- Error `Operator '<' must be spaced` หรือ `'boolean' is not defined` ใน `.vue` = อาการนี้
