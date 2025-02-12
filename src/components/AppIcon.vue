<template>
    <span class="icon-wrapper">
        <i :class="iconClass"></i>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    name: string;
}>();

const iconClass = computed(() => {
    const iconMap: Record<string, string> = {
        tech: 'fas fa-wrench',
        support: 'fas fa-headset',
        solution: 'fas fa-lightbulb',
        phone: 'fas fa-phone',
        arrow: 'fas fa-arrow-right',
        consult: 'fas fa-comments',
        install: 'fas fa-tools',
        training: 'fas fa-chalkboard-teacher',
        maintenance: 'fas fa-cogs',
        repair: 'fas fa-screwdriver'
    };

    return iconMap[props.name] || 'fas fa-question';
});
</script>

<style scoped>
.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

i {
    font-size: 1.2rem;
    line-height: 1;
}
</style>
