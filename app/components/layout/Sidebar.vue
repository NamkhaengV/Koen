<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: true });
</script>

<template>
    <aside
        v-show="isOpen"
        :class="['h-dvh p-4 border-r border-gray-200',
                 isOpen ? 'w-64' : 'w-0',
        ]"
    >
        <section name="title">

        </section>

        <section name="menu">

        </section>

        <section name="detail">

        </section>
    </aside>
</template>

<style scoped>

</style>
