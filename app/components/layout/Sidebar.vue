<script setup lang="ts">
import { menuItems } from '@/constants/menu';

const isOpen = defineModel<boolean>('open', { default: true });
</script>

<template>
    <aside
        v-show="isOpen"
        :class="['h-dvh p-4 flex flex-col gap-12',
                 isOpen ? 'w-74' : 'w-0',
        ]"
    >
        <section name="title">
            <div class="flex items-baseline gap-2">
                <h1 class="text-3xl font-semibold">ガーデン</h1>
                <span class="font-sans">Widget</span>
            </div>
        </section>

        <section name="menu" class="flex flex-col gap-y-2">
            <div
                v-for="(menu, index) in menuItems"
                :key="index"
                class="p-2 flex items-center gap-2 hover:border border-primary rounded-xl"
            >
                <div class="w-5 h-5 border rounded-full"><!-- Icon --></div>
                <span>{{ menu.name }}</span>
            </div>
        </section>

        <section name="info" class="mt-auto">
            <!-- Patch -->
            <div></div>

            <!-- Profile -->
            <div class="p-2 flex items-center gap-2 border rounded-xl">
                <div class="h-8 w-8 border rounded-full"></div>

                <div class="flex flex-col">
                    <span class="text-sm text-gray-500">ACCOUNT</span>
                    <span>{{ 'Okamitani Reien' }}</span>
                </div>
            </div>
        </section>
    </aside>
</template>

<style scoped>
* {
    color: white;
}
</style>
