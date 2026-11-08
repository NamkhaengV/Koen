# Knowledge index

**สถานะ 2026-11-08:** โค้ดเป็น Nuxt 4 + Tailwind v4 + theme + layout/Sidebar + ESLint/Stylelint (commit `e7652ba`).
หน้ามี `/`, `/chat` และโฟลเดอร์ว่าง `notification/`, `text-animation/`. **ยังไม่มี backend** —
Supabase + frontend ชุดแรกถูกล้างทิ้งเมื่อ 2026-11-08 ~15:10 (user ทำ frontend เอง).

Supabase project `dghpweosummdtmhnaswk` ยังอยู่แต่ว่าง; เหลือ Redirect URL `http://localhost:3000/confirm`
ใน Auth → URL Configuration. Supabase CLI 3 ชี้ local เป็น default — คำสั่งกับ project จริงต้อง `--remote`.

⚠️ **ยังไม่ตัดสิน:** `PROJECT_CONCEPT.md` = Supabase + config ใน DB, แต่ skill `learn` = static SPA + config ใน URL.
Note ที่ติด 🅿 คือ "แผนตาม concept" ยังไม่มีในโค้ด.

## decisions
- 🅿 [Config ใน DB ไม่ใช่ URL](decisions/config-in-db-not-url.md) — localStorage ของ OBS แยกจาก Chrome + HTTP 431; overlay ห้ามพึ่ง browser storage
- 🅿 [Overlay public access](decisions/overlay-public-access.md) — RPC security definer + Broadcast; `select using (true)` ทำให้ list widget ทุกคนได้
- 🅿 [Token อยู่ server](decisions/tokens-server-only.md) — `provider_tokens` RLS on ไม่มี policy = deny-all ตั้งใจ

## technical
- 🅿 [schema_version](technical/config-schema-version.md) — ลิงก์ใน OBS อยู่ตลอดไป, config เก่าต้อง render ได้เสมอ
- [TypeScript pin ~6.0](technical/typescript-version-pin.md) — ไม่มี `typescript` = ESLint แก้ `ref<boolean>` พังตอน save
- [baseURL กับ asset](technical/deploy-baseurl-assets.md) — path ใน TS ไม่ได้ prefix baseURL; badge 404 บน GitHub Pages

## platforms
- [Twitch EventSub WebSocket](platforms/twitch-eventsub-websocket.md) — subscribe ภายใน ~10s หลัง welcome; legacy จัดการ session_reconnect ผิด
- [Twitch IRC (tmi.js)](platforms/twitch-irc-chat.md) — legacy XSS ผ่าน emote; index เป็น code point; mystery gift ได้ alert ซ้ำ

## business
- [OBS Browser Source](business/obs-browser-source.md) — CEF storage แยกจาก Chrome; shutdown/refresh ทำให้ overlay เกิดใหม่บ่อย
- 🅿 [คำศัพท์ widget/overlay](business/widget-overlay-model.md) — widget, editor, overlay, secret link, preview, alert

## ui
- [Theme = CSS variables](ui/theme-css-variables.md) — token อยู่ `:root` ไม่ใช่ `@theme`; body ไม่มี bg; overlay ต้องใช้ layout แยก
