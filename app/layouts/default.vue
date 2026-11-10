<script setup lang="ts">
const isSidebarOpen = ref<boolean>(true);
</script>

<template>
    <div class="root-layout">
        <div class="glassy">
            <LayoutSidebar v-model:open="isSidebarOpen" />

            <main class="main">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
.glassy {
    display: flex;
    flex: 1;

    /* background: rgba(135, 206, 250, 0.20);  */
    background: rgba(255, 255, 255, 0.08);
    /* border-radius: 0 16px 16px 0; */
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(11.2px);
    border: 0 solid rgba(135, 206, 250, 0.15);
}

.main {
    display: flex;
    flex: 1;
    flex-direction: column;

    border-radius: 16px;
    background-color: var(--color-bg);

    margin: 8px;
    padding: 20px;
}

.root-layout {
    display: flex;

    height: 100vh;
    height: 100dvh;

    background-image: url('@/assets/images/Forest.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    overflow: hidden;
}
</style>
