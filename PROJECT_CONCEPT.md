# Koen - Stream Overlay — Project Concept

เว็บไซต์รวมเครื่องมือ **OBS Browser Source Overlay** สำหรับสตรีมเมอร์
ผู้ใช้ตั้งค่า widget บนเว็บ → ได้ลิงก์ → นำไปวางใน OBS (Browser Source) ได้ทันที

> อ้างอิงบทเรียนจากโปรเจคเก่า "レイヱン ChatWidget" (Twitch Overlay) — ดูหัวข้อ 9

---

## 1. เป้าหมาย

- เป็น **hub ของ widget หลายตัว** ในเว็บเดียว ใช้ระบบ editor / preview / overlay ร่วมกัน
- ผู้ใช้ทั่วไปใช้ได้ (ไม่ใช่แค่เจ้าของโปรเจค) → มีระบบบัญชี + เก็บ config ฝั่ง server
- ลิงก์ overlay แก้ค่าแล้ว **อัปเดตใน OBS ทันที** (realtime) ไม่ต้อง copy ลิงก์ใหม่

## 2. Widget ที่วางแผนไว้

| Widget | สถานะ | รายละเอียดคร่าว ๆ |
|---|---|---|
| 💬 **Chat Widget** | **Phase 1 (ทำก่อน)** | แชท Twitch + emote + badge + สีตาม role; YouTube ในอนาคต |
| 🔔 Notification | Planned | follow / sub / gift / raid / bits alert |
| ✨ Text Animation | Planned | ข้อความวิ่ง / เด้ง / ticker |
| 🕐 Clock | Planned | นาฬิกา, countdown, timer, uptime |
| 🪪 Info Card | Planned | การ์ดข้อมูลสตรีมเมอร์ / social / schedule หมุนเวียน |

## 3. Tech Stack

| ส่วน | ใช้ |
|---|---|
| Framework | Nuxt + Vue 3 `<script setup>` + TypeScript |
| Styling | Tailwind CSS + CSS variables (theme tokens) + scoped CSS เมื่อจำเป็น |
| Twitch chat | `tmi.js` (IRC over WebSocket, anonymous) |
| Twitch events | EventSub — ทำฝั่ง server เพื่อไม่ให้ token อยู่ใน browser |
| Backend / DB | **Supabase** (Postgres + Auth + Realtime + Storage) ผ่าน `@nuxtjs/supabase` — ดูหัวข้อ 6 |
| Changelog | `@nuxt/content` (markdown ใน repo) |
| Hosting | Vercel / Cloudflare Pages / Netlify (ต้องมี server routes จึงไม่ใช้ GitHub Pages) |

## 4. โครงสร้างหน้า (Routes)

| Route | หน้าที่ |
|---|---|
| `/` | Landing — แนะนำเครื่องมือ, ลิงก์ไป dashboard |
| `/login` | Login: Twitch / Discord / Email |
| `/dashboard` | รายการ widget ของผู้ใช้ (สร้าง / ลบ / duplicate) |
| `/dashboard/chat/[id]` | Editor ของ chat widget: panels + live preview + copy OBS URL |
| `/dashboard/<widget>/[id]` | Editor ของ widget อื่น (โครงเดียวกัน) |
| `/overlay/chat/[id]` | **OBS overlay** — โปร่งใส, ไม่มี UI, โหลด config จาก id |
| `/overlay/<widget>/[id]` | overlay ของ widget อื่น |
| `/changelog` | Update patch / release notes |

- `[id]` = UUID ที่เดาไม่ได้ → ลิงก์ overlay เป็น "secret link" (OBS ไม่ต้อง login)
- `/overlay/**` ใช้ `routeRules` ตั้ง `ssr: false` + layout ว่าง + `body { background: transparent }`

## 5. Data Flow

```
┌──── /dashboard/chat/[id] (browser) ────┐
│ แก้ค่า → state → live preview (mock)    │
│      └─ debounce → save ลง DB (widgets)  │
└──────────────────────────────────────────┘
                 │ Realtime (UPDATE)
                 ▼
┌──── /overlay/chat/[id] (OBS) ───────────┐
│ fetch config by id → apply CSS vars      │
│ subscribe realtime → เปลี่ยนตามทันที      │
│ ต่อ Twitch IRC → render feed             │
└──────────────────────────────────────────┘
```

- **Config ทั้งหมดอยู่ใน DB** ไม่ยัดลง URL → URL สั้น, ไม่ติด HTTP 431
- **รูปที่อัปโหลด** (badge, พื้นหลัง) → Supabase Storage เก็บเป็น URL ไม่ใช่ base64
- **Token / secret** อยู่ฝั่ง server เท่านั้น overlay ได้แค่ config สาธารณะ

## 6. Backend & Database

**ตัดสินใจแล้ว: ใช้ Supabase** — ได้ Database, Auth, Realtime, Storage ครบในที่เดียว โฟกัสที่ตัว widget ได้เต็มที่

### ส่วนที่ใช้ของ Supabase

| Feature | ใช้ทำอะไร |
|---|---|
| **Postgres** | เก็บ profiles / widgets; config เป็น `jsonb` ยืดหยุ่นต่อ widget หลายแบบ |
| **Auth** | Login ด้วย Twitch, Discord (OAuth) และ Email (magic link) |
| **Realtime (Broadcast)** | editor ส่งค่าใหม่ → overlay ใน OBS อัปเดตทันที |
| **Storage** | bucket `widget-assets` เก็บ badge / รูปพื้นหลัง (public read) |
| **RLS** | ผู้ใช้อ่าน/แก้ได้เฉพาะ widget ของตัวเอง |
| **Edge Functions** (ภายหลัง) | งานที่ต้องใช้ secret เช่น refresh Twitch token |

### Auth setup
- เปิด provider **Twitch**, **Discord**, **Email** ใน Supabase Dashboard → Authentication → Providers
- สร้าง app ที่ [Twitch Developer Console](https://dev.twitch.tv/console) และ [Discord Developer Portal](https://discord.com/developers/applications) แล้วใส่ Redirect URL เป็น `https://<project>.supabase.co/auth/v1/callback`
- ฝั่ง Nuxt: `@nuxtjs/supabase` ตั้ง `redirectOptions` ให้ `/dashboard/**` ต้อง login, ส่วน `/`, `/overlay/**`, `/changelog` ไม่ต้อง
- trigger `on auth.users insert` → สร้างแถวใน `profiles` อัตโนมัติ

### การเข้าถึง config ของ overlay (สำคัญ)
OBS ไม่ได้ login จึงต้องอ่าน config ด้วย id อย่างเดียว **โดยไม่เปิดให้ list widget ของคนอื่นได้**
- ❌ ไม่ใช้ RLS policy `select using (true)` บนตาราง `widgets` (anon key จะ list ได้ทั้งตาราง)
- ✅ ใช้ RPC `get_widget_public(id uuid)` แบบ `security definer` คืนเฉพาะ `type`, `config`, `schema_version` ของ id นั้น
- ✅ Realtime ใช้ **Broadcast channel** ชื่อ `widget:<id>` — editor ส่ง config ใหม่หลัง save, overlay subscribe channel นั้น (ไม่ต้องเปิด Postgres Changes บนตาราง)

### Schema คร่าว ๆ

```sql
profiles (
  id uuid pk references auth.users,
  display_name text,
  twitch_login text,
  created_at timestamptz
)

widgets (
  id uuid pk default gen_random_uuid(),   -- ใช้ใน overlay URL
  owner_id uuid references profiles,
  type text,            -- 'chat' | 'notification' | 'text' | 'clock' | 'info'
  name text,
  config jsonb,         -- ค่าตั้งค่าของ widget
  schema_version int,   -- ใช้ migrate config เมื่อ format เปลี่ยน
  updated_at timestamptz
)

-- token ของ Twitch (EventSub) แยกเก็บ ห้าม expose ให้ client
-- RLS เปิดแต่ไม่มี policy → client เข้าไม่ได้, ใช้ได้เฉพาะ service role ฝั่ง server
provider_tokens (
  user_id uuid, provider text,
  access_token text, refresh_token text, expires_at timestamptz
)
```

RLS ของ `widgets`:
```sql
alter table widgets enable row level security;
create policy "owner all" on widgets
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```

### Environment / Secrets
| ตัวแปร | ใช้ที่ |
|---|---|
| `SUPABASE_URL`, `SUPABASE_KEY` (anon) | client + server |
| `SUPABASE_SERVICE_KEY` | server routes เท่านั้น (ห้ามขึ้น client) |
| `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` | ตั้งใน Supabase Auth + server (EventSub) |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | ตั้งใน Supabase Auth |

### ข้อควรรู้
- **Free tier**: project จะถูก pause ถ้าไม่มีการใช้งานต่อเนื่องราว 1 สัปดาห์ และมีโควต้า DB/Storage จำกัด (เช็กตัวเลขล่าสุดที่หน้า pricing ของ Supabase)
- ใช้ **Supabase CLI** (`supabase init`, `supabase migration new`) เก็บ schema/policy เป็นไฟล์ migration ใน repo — `supabase/migrations/`
- generate type: `supabase gen types typescript` → `types/database.ts`
- **อนาคต** (EventSub, YouTube chat) ต้องมี process รันค้าง → เพิ่ม worker เล็ก ๆ (Railway / Fly.io / VPS) ที่ใช้ service key อ่าน token จาก `provider_tokens`

## 7. Update Patch / Changelog

**ไม่จำเป็นต้องมี backend**
- เขียน markdown ใน `content/changelog/*.md` → `@nuxt/content` render หน้า `/changelog`
- frontmatter: `version`, `date`, `tags` (feature / fix / breaking)
- (ทางเลือก) badge "มีอัปเดตใหม่" ใน dashboard โดยเทียบ `version` ล่าสุดกับค่าใน `localStorage`
- **ฝั่ง config**: เปลี่ยน format เมื่อไหร่ → เพิ่ม `schema_version` + `migrateConfig(old → new)` เพื่อให้ overlay เก่าที่ผู้ใช้แปะไว้ใน OBS ไม่พัง

## 8. Phase 1 — Chat Widget (Twitch)

ฟีเจอร์:
- แชท + emote + badge (default / custom upload) + สี username ตาม role
- ปรับ bubble / accent / typography / layout / max messages / message lifetime
- Live preview ด้วย mock feed + พื้นหลัง preview (solid / gradient / image)
- Copy OBS URL + realtime update
- (optional) alert ในแชท: sub / resub / gift / raid / bits ผ่าน IRC; follow ผ่าน EventSub ฝั่ง server

โครงโค้ด (แตกให้เล็กตั้งแต่ต้น):
```
composables/
  useWidgetConfig.ts     # load / save / subscribe config จาก DB
  useTwitchIrc.ts        # tmi.js connect / reconnect / cleanup
  useChatFeed.ts         # feed model, max cap, lifetime
components/
  chat/ChatItem.vue, chat/AlertCard.vue, chat/ChatPreview.vue
  editor/Panel.vue, editor/ColorField.vue, editor/SliderField.vue
utils/
  color.ts, twitch-parse.ts (emotes, badges), labels.ts (tier / months / bits)
types/
  widget.ts              # WidgetType, ChatConfig, FeedItem (discriminated union)
```

Platform abstraction เผื่อ YouTube:
```ts
interface ChatSource {
  connect(): void
  disconnect(): void
  on(event: 'message' | 'alert' | 'status', cb: (payload: unknown) => void): void
}
// ตอนนี้ TwitchSource (tmi.js) → ภายหลัง YouTubeSource (ดึงผ่าน server)
```

## 9. บทเรียนจากโปรเจคเก่า

- ❌ **localStorage ของ OBS แยกจาก browser ปกติ** → custom badge / token ที่เซฟจาก Chrome ไปไม่ถึง OBS → แก้ด้วย DB
- ❌ ยัด config ลง URL ยาว → แก้ด้วย UUID + DB
- ❌ OAuth token อยู่ใน browser (implicit grant, ไม่มี refresh) → ย้ายไป server + refresh token
- ❌ `chat.vue` / `settings.vue` เป็น monolith 1k+ บรรทัด → แตก component + composable
- ❌ helper ซ้ำหลายไฟล์ → รวมไว้ `utils/`
- ✅ เก็บไว้: CSS variables เป็น theme API, discriminated union feed, mock feed สำหรับ preview, reconnect + keepalive + cleanup on unmount, route groups แยก widget

## 10. Roadmap

1. **Phase 0** — ตั้งโปรเจค Nuxt + Tailwind, สร้าง Supabase project + migrations (profiles, widgets, RLS, RPC), Auth (Twitch / Discord / Email), layout dashboard
2. **Phase 1** — Chat Widget (Twitch) + overlay realtime + changelog
3. **Phase 2** — Notification widget (EventSub ฝั่ง server)
4. **Phase 3** — Clock, Text Animation, Info Card
5. **Phase 4** — YouTube chat, theme presets, แชร์ preset, i18n (TH / EN / JP)
