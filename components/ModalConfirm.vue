<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-2xl mb-4">{{ title }}</h2>
            <p class="mb-6">{{ message }}</p>
            <div class="flex justify-end">
                <button @click="confirm" class="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded mr-2">{{ confirmText }}</button>
                <button @click="cancel" class="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">{{ cancelText }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    confirmText: {
        type: String,
        required: true,
    },
    cancelText: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => {
    emit("confirm");
};

const cancel = () => {
    emit("cancel");
};
</script>
