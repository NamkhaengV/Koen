<script lang="ts" setup>

</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="py-4">
            ← PAGE HEADER
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                CHAT PREVIEW

                <div class="min-h-[calc(100dvh-26rem)]  max-h-[calc(100dvh-26rem)] p-4 rounded-xl bg-gray-200">
                    PREVIEW HERE
                </div>

                <div class="">
                    <span class="font-semibold">🔗 OBS URL</span>

                    <div class="p-2 text-sm border border-gray-200 rounded-xl bg-[#87cefa]/20">TEST URL</div>
                </div>
            </div>

            <div class="max-h-[calc(100dvh-6.5rem)] flex flex-col gap-4 overflow-auto custom-scroll">
                <div
                    v-for="card in 10"
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

<style>

</style>
