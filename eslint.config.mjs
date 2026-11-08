// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

/**
 * ESLint — จัดรูปแบบโค้ดเท่านั้น (ยังไม่ตรวจ logic)
 *
 * ไฟล์ .vue จะถูกจัดเป็น:
 *   <script setup lang="ts">   ← ลำดับ script → template → style
 *   // ชิดซ้าย ไม่เยื้อง (ข้างในเยื้องทีละ 4 ช่อง)
 *   </script>
 *                              ← เว้น 1 บรรทัดระหว่าง block
 *   <template>
 *       <!-- เยื้อง 4 ช่อง -->
 *   </template>
 *
 * ส่วน <style> จัดด้วย stylelint (stylelint.config.mjs) เพราะ ESLint ไม่อ่าน CSS
 */
export default withNuxt(
    // ── ไฟล์ .ts / .js ทั่วไป ─────────────────────────────
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }]
        }
    },

    // ── ไฟล์ .vue ────────────────────────────────────────
    {
        files: ['**/*.vue'],
        rules: {
            // ปิด indent ปกติ แล้วใช้ของ vue ที่รองรับ baseIndent แทน
            '@stylistic/indent': 'off',

            // เนื้อหาใน <script> ชิดซ้าย (baseIndent 0)
            'vue/script-indent': ['error', 4, { baseIndent: 0, switchCase: 1 }],

            // เยื้องเนื้อหาใน <template> 1 ระดับ
            'vue/html-indent': ['error', 4, {
                baseIndent: 1,
                attribute: 1,
                closeBracket: 0,
                alignAttributesVertically: true
            }],

            // ลำดับ block + เว้นบรรทัดระหว่าง block
            'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
            'vue/padding-line-between-blocks': ['error', 'always'],

            // template
            'vue/html-quotes': ['error', 'double'],
            'vue/html-self-closing': ['error', {
                html: { void: 'always', normal: 'never', component: 'always' }
            }],
            'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }],
            'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'always' }],
            'vue/html-closing-bracket-spacing': 'error',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off'
        }
    },

    // ── สไตล์โค้ดทุกไฟล์ ──────────────────────────────────
    {
        rules: {
            '@stylistic/quotes': ['error', 'single', {
                avoidEscape: true,
                allowTemplateLiterals: 'always'
            }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
            '@stylistic/quote-props': 'off',
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/eol-last': ['error', 'always'],

            // ปิด rule ที่ไม่เกี่ยวกับการจัดรูปแบบ (เปิดทีหลังเมื่อพร้อม)
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
);
