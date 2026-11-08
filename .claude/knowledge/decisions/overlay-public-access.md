---
title: Overlay อ่าน config แบบไม่ login — ผ่าน RPC + Broadcast เท่านั้น
area: decisions
scope: backend
sources:
  - .claude/PROJECT_CONCEPT.md
updated: 2026-11-08
---

## What
OBS ไม่ได้ login จึงใช้ anon key. Overlay โหลด config ผ่าน RPC `get_widget_public(id uuid)`
(`security definer`, คืนแค่ `type`, `config`, `schema_version`) และรับ update ผ่าน Supabase Realtime
**Broadcast** channel `widget:<id>` ที่ editor ส่งหลัง save. RLS ของ `widgets` มีแค่ policy owner.

## Why
- ทางลัด `select using (true)` บน `widgets` ทำให้ใครถือ anon key (ซึ่งอยู่ใน JS bundle อยู่แล้ว)
  **list widget ทั้งตาราง** ได้ — UUID ไม่เป็นความลับอีกต่อไป และเห็น `owner_id`/`name` ของทุกคน
- Postgres Changes ต้องให้ anon select ตารางได้ถึงจะรับ event → ติดปัญหาเดียวกัน. Broadcast ไม่ผูกกับ RLS ของตาราง

## Where it shows up
- `supabase/migrations/20261108144316_init_schema.sql` — RLS, grants, RPC
- `app/pages/overlay/chat/[id].vue` — overlay เรียก RPC
- `.claude/PROJECT_CONCEPT.md:96-99` — กฎการเข้าถึง

## Gotchas
- **Concept doc ขัดกันเอง**: diagram หัวข้อ 5 (`.claude/PROJECT_CONCEPT.md:61`) เขียน `Realtime (UPDATE)`
  ชวนให้เข้าใจว่าใช้ Postgres Changes. ตัวที่ตัดสินแล้วคือ Broadcast (บรรทัด 84, 99)
- Broadcast ไม่ persist — overlay ที่หลุด connection ช่วง editor save จะพลาด event.
  ควร refetch ผ่าน RPC ตอน reconnect (ข้อสรุปจาก design นี้ ยังไม่ได้เขียนใน doc)
- RPC ห้ามคืน `owner_id` หรือ field อื่นเพิ่ม — ถือเป็น public API
- `supabase db advisors` เตือน `anon_security_definer_function_executable` บน `get_widget_public` —
  **ตั้งใจ** อย่า revoke. แต่ function อื่นที่ security definer (เช่น trigger `handle_new_user`) ต้อง
  revoke execute จาก `anon, authenticated` เพราะ Supabase grant ให้อัตโนมัติ (migration `lock_trigger_functions`)
- Broadcast channel ยังไม่ได้ตัดสิน: public channel = ใครรู้ id ส่ง config ปลอมเข้า overlay ได้.
  ทางที่ปลอดภัยกว่าคือ private channel + RLS บน `realtime.messages` (owner ส่ง, anon รับ) — ตัดสินใน Phase 1
- Bucket `widget-assets` เป็น public read (`.claude/PROJECT_CONCEPT.md:85`) — รูปที่อัปโหลดเปิดได้ทุกคนที่รู้ URL
- Supabase free tier pause project ถ้าไม่มีใช้งาน ~1 สัปดาห์ (`.claude/PROJECT_CONCEPT.md:145`)
  → overlay ของ **ผู้ใช้ทุกคน** โหลด config ไม่ได้พร้อมกัน

Related: [[config-in-db-not-url]], [[tokens-server-only]]
