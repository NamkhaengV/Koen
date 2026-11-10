<script lang="ts" setup>

</script>

<template>
    <div class="flex flex-col gap-5 over">
        <div class="py-4">
            ← PAGE HEADER
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                CHAT PREVIEW

                <div class="min-h-[calc(100dvh-26rem)]  max-h-[calc(100dvh-26rem)] p-4 rounded-xl transparent-grid">
                    PREVIEW HERE
                </div>

                <div class="">
                    <span class="font-semibold">🔗 OBS URL</span>

                    <div class="p-2 text-sm border border-gray-200 rounded-xl bg-[#87cefa]/20">TEST URL</div>
                </div>
            </div>

            <div class="max-h-[calc(100dvh-8.5rem)] flex flex-col gap-4 overflow-auto custom-scroll">
                <div
                    v-for="card in 12"
                    :key="card"
                    class="p-4 flex flex-col gap-2 border rounded-xl"
                >
                    <div class="flex items-center justify-between cursor-pointer">
                        <span class="font-semibold">Setting</span>
                        <div class="text-2xl">▾</div>
                    </div>

                    <div>
                        Setting Detail
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Checkerboard pattern that shows transparency, like an image editor */
.transparent-grid {
    background-color: #fff;
    background-image:
        linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
        linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
        linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
}
</style>
