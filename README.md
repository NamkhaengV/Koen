# 🎮 Koen - Stream Overlay — Nuxt 4

เว็บรวมเครื่องมือ Overlay สำหรับ Streamer ตั้งค่า widget บนเว็บ → ได้ลิงก์ → วางใน OBS (Browser Source) ได้ทันที
ปรับแต่งได้ตามใจชอบ แก้ค่าแล้ว OBS เปลี่ยนตามทันทีโดยไม่ต้อง copy ลิงก์ใหม่
Developed by [ReienOkami](https://x.com/ReienOkami)

> ต่อยอดจากโปรเจคเก่า **レイヱン ChatWidget** (Twitch Chat Overlay) — รายละเอียดการออกแบบอยู่ใน [PROJECT_CONCEPT.md](PROJECT_CONCEPT.md)

## 🧩 Widget

| Widget | สถานะ | รายละเอียด |
|--------|-------|-----------|
| 💬 Chat Widget | 🚧 กำลังทำ (Phase 1) | แชท Twitch + emote + badge + สีตาม role; YouTube ในอนาคต |
| 🔔 Notification | 🗓 plan | alert follow / sub / gift / raid / bits |
| ✨ Text Animation | 🗓 plan | ข้อความวิ่ง / เด้ง / ticker |
| 🕐 Clock | 🗓 plan | นาฬิกา, countdown, timer, uptime |
| 🪪 Info Card | 🗓 plan | การ์ดข้อมูลสตรีมเมอร์ / social / schedule หมุนเวียน |

## ⚙️ ตั้งค่าใน OBS

> ⚠️ หน้า overlay ยังไม่พร้อมใช้ — ขั้นตอนนี้คือวิธีที่จะใช้เมื่อเปิดใช้งาน

1. Add Source → **Browser Source**
2. URL: ลิงก์ที่ copy จากหน้าตั้งค่า widget (เช่น `/overlay/chat/<id>`)
3. Width / Height: ตามขนาดที่ตั้งไว้ใน widget
4. Custom CSS:
   ```css
   body { background: transparent !important; overflow: hidden; }
   ```
5. ✅ **Shutdown source when not visible** — ซ่อน source แล้วตัดการเชื่อมต่อ Twitch อัตโนมัติ (ลดโหลด CPU + memory)
6. ✅ **Refresh browser when scene becomes active** — รีเฟรชอัตโนมัติเมื่อเปลี่ยนมาใช้ฉากนี้

ลิงก์ overlay ใช้ได้โดยไม่ต้อง login — `<id>` เป็นรหัสที่เดาไม่ได้ อย่าแชร์ลิงก์ให้คนอื่น

## 🎨 ปรับแต่ง Chat Widget

เปิดหน้า `/chat` เพื่อ:
- เปลี่ยนสี bubble / accent + opacity
- ปรับสี text / font / ขนาด font
- ปรับความกว้าง / ช่องว่างระหว่าง message / จำนวนข้อความสูงสุด / อายุข้อความ
- ปรับสี username ตาม role (broadcaster / mod / vip / sub)
- ใช้ badge default หรืออัปโหลด badge ของตัวเอง
- ดู live preview ได้ทันที (เปลี่ยนพื้นหลัง preview ได้: solid / gradient / image)

Settings จะเก็บไว้ที่ server ไม่ใช่ใน browser — แก้จากเครื่องไหนก็เปลี่ยนใน OBS ทันที

# 🎐 คู่มือสำหรับ Developer

## 🛠️ Tech Stack

Nuxt 4 + Vue 3 `<script setup>` + TypeScript · Tailwind CSS v4 + CSS variables · ESLint + Stylelint
แผน: `tmi.js` (Twitch IRC) · Twitch EventSub · Supabase (DB / Auth / Realtime / Storage) · `@nuxt/content` (changelog)

## โครงสร้าง Project

```
koen/
├── app/
│   ├── app.vue                  ← root: <NuxtLayout> + <NuxtPage>
│   ├── assets/css/
│   │   └── main.css             ← theme token (CSS variables) + Tailwind
│   ├── components/layout/
│   │   └── Sidebar.vue          ← sidebar ของหน้าเว็บ
│   ├── layouts/
│   │   └── default.vue          ← layout หลัก (sidebar + เนื้อหา)
│   └── pages/
│       ├── index.vue            ← หน้าแรก
│       └── chat/index.vue       ← ตั้งค่า Chat Widget
├── public/                      ← static files
├── PROJECT_CONCEPT.md           ← concept, data flow, schema, roadmap
├── .claude/knowledge/           ← เหตุผลของการตัดสินใจ + gotcha
└── nuxt.config.ts
```

## 🚀 Dev การติดตั้ง

ต้องมี **Node.js 26** และ **pnpm**

```bash
# 1. clone repo
git clone https://github.com/NamkhaengV/koen.git

# 2. ติดตั้ง dependencies
pnpm install

# 3. รัน dev server
pnpm dev

# 4. เปิดเว็บ → http://localhost:3000
# 5. ตั้งค่า Chat Widget → http://localhost:3000/chat
```

| คำสั่ง | ใช้ทำ |
|--------|-------|
| `pnpm build` | build สำหรับ production |
| `pnpm preview` | เปิดดู build ในเครื่อง |
| `pnpm lint` | เช็กรูปแบบโค้ด (ESLint + Stylelint) |
| `pnpm lint:fix` | จัดรูปแบบโค้ดอัตโนมัติ |

VS Code: ลง extension **ESLint** และ **Stylelint** — โปรเจคตั้งให้จัดรูปแบบตอน save แล้ว ถ้าเปิด Prettier ไว้ให้ปิดสำหรับโปรเจคนี้

## 🌐 Deploy

ต้องใช้ host ที่มี server routes (Vercel / Cloudflare Pages / Netlify) — **ไม่ใช้ GitHub Pages** เพราะต้องมีฝั่ง server เก็บ token และ config

## 🧭 หลักที่ต้องรู้ก่อนเขียนโค้ด

บทเรียนจาก レイヱン ChatWidget:
- **หน้า overlay ต้องโปร่งใส** — `html` / `body` ไม่มี background ใส่พื้นหลังที่ layout ของเว็บแทน
- **Overlay ห้ามพึ่ง localStorage** — OBS มี storage แยกจาก browser ปกติ ค่าที่เซฟจาก Chrome ไปไม่ถึง OBS
- **ห้ามยัด config ยาวๆ หรือรูป base64 ลง URL** — เจอ HTTP 431
- **Token / secret อยู่ฝั่ง server เท่านั้น** — overlay ได้แค่ config สาธารณะ
- **ลิงก์ overlay ที่ผู้ใช้แปะใน OBS อยู่ตลอดไป** — เปลี่ยน format ของ config ต้องมี migration
- **`typescript` ต้อง pin ที่ `~6.0`** — ESLint parser ยังไม่รองรับเวอร์ชันใหม่กว่า

## 📌 Feature (on / plan)

— Phase 0: ตั้งโปรเจค
- [✓] Nuxt 4 + Tailwind CSS v4 + TypeScript
- [✓] Theme token (CSS variables) — light theme สี Light Sky Blue, font Krub
- [✓] Layout หลัก + Sidebar
- [✓] ESLint + Stylelint
- [ ] Supabase: DB + RLS + Storage
- [ ] Login: Twitch / Discord / Email (magic link)
- [ ] Dashboard: สร้าง / ลบ / duplicate widget

— Phase 1: Chat Widget (Twitch)
- [ ] หน้าตั้งค่า `/chat` (สร้างหน้าแล้ว ยังไม่มีเนื้อหา)
- [ ] แชท + emote + badge (default / custom upload)
- [ ] สี username ตาม role
- [ ] ปรับ bubble / accent / typography / layout / max messages / message lifetime
- [ ] Live preview ด้วย mock feed + พื้นหลัง preview (solid / gradient / image)
- [ ] หน้า overlay โปร่งใสสำหรับ OBS + Copy OBS URL
- [ ] Realtime: แก้ค่าแล้ว OBS เปลี่ยนตามทันที
- [ ] Alert ในแชท: sub / resub / gift / raid / bits (IRC), follow (EventSub)
- [ ] หน้า Changelog

— Phase 2: Notification
- [ ] Alert follow / sub / gift / raid / bits ผ่าน EventSub ฝั่ง server

— Phase 3: Widget อื่น
- [ ] Clock
- [ ] Text Animation
- [ ] Info Card

— Phase 4: ต่อยอด
- [ ] YouTube Chat
- [ ] Theme preset + แชร์ preset
- [ ] i18n (TH / EN / JP)
