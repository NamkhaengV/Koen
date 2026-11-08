<script setup lang="ts">
const isSidebarOpen = ref<boolean>(true);
</script>

<template>
    <div class="root-layout">
        <LayoutSidebar v-model:open="isSidebarOpen" />

        <main class="p-4 flex-1">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.root-layout {
    display: flex;

    height: 100vh;
    height: 100dvh;

    background-color: var(--color-bg);
}
</style>
