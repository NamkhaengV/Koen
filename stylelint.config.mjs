/**
 * Stylelint — จัดรูปแบบ <style> ในไฟล์ .vue และไฟล์ .css
 *
 *   <style scoped>
 *       .box {            ← เยื้อง 1 ระดับใน <style>
 *           color: red;
 *       }
 *   </style>
 */
export default {
    extends: ['stylelint-config-recommended-vue'],
    plugins: ['@stylistic/stylelint-plugin'],
    overrides: [
        { files: ['**/*.vue'], customSyntax: 'postcss-html' }
    ],
    rules: {
        // เยื้อง 4 ช่อง และเยื้องเพิ่ม 1 ระดับเมื่ออยู่ใน <style>
        '@stylistic/indentation': [4, { baseIndentLevel: 1 }],

        // แตก rule บรรทัดเดียวเป็นหลายบรรทัด: .a {color:red} → .a {\n color: red;\n}
        '@stylistic/block-opening-brace-space-before': 'always',
        '@stylistic/block-opening-brace-newline-after': 'always',
        '@stylistic/block-closing-brace-newline-before': 'always',
        '@stylistic/declaration-block-semicolon-newline-after': 'always',
        '@stylistic/declaration-block-trailing-semicolon': 'always',
        '@stylistic/declaration-colon-space-after': 'always',

        // เว้นบรรทัดระหว่าง rule
        'rule-empty-line-before': ['always', {
            except: ['first-nested'],
            ignore: ['after-comment']
        }],

        // ปิด rule ที่ไม่เกี่ยวกับการจัดรูปแบบ
        'no-descending-specificity': null,
        'no-empty-source': null
    }
};
