# Knowledge index

2026-11-08: repo ถูกล้างกลับเป็น Nuxt 4 minimal (user ทำ frontend เอง). ไม่มี Tailwind/Supabase/content ในโค้ด.
Supabase project `dghpweosummdtmhnaswk` ถูกล้างด้วย (schema, bucket, auth users, migration history) — เปล่าเหมือนใหม่.
ยังเหลือ: Redirect URL `http://localhost:3000/confirm` ใน Auth → URL Configuration.
Supabase CLI 3 ชี้ local เป็น default — คำสั่งกับ project จริงต้อง `--remote`.

## decisions
- [Config ใน DB ไม่ใช่ URL](decisions/config-in-db-not-url.md) — localStorage ของ OBS แยกจาก Chrome + HTTP 431; overlay ห้ามพึ่ง browser storage
- [Overlay public access](decisions/overlay-public-access.md) — RPC security definer + Broadcast; `select using (true)` ทำให้ list widget ทุกคนได้
- [Token อยู่ server](decisions/tokens-server-only.md) — `provider_tokens` RLS on ไม่มี policy = deny-all ตั้งใจ

## technical
- [schema_version](technical/config-schema-version.md) — ลิงก์ใน OBS อยู่ตลอดไป, config เก่าต้อง render ได้เสมอ

## business
- [คำศัพท์ widget/overlay](business/widget-overlay-model.md) — widget, editor, overlay, secret link, preview, alert

## ui
- [CSS variables = theme API](ui/theme-css-variables.md) — ค่าผู้ใช้ผ่าน var, overlay ห้ามมี background
