<template>
    <div class="icon-test">
        <div v-for="name in iconNames" :key="name" class="icon-item">
            <AppIcon :name="name" />
            <span>{{ name }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue';

const iconNames = [
    'tech',
    'support',
    'solution',
    'phone',
    'arrow',
    'consult',
    'install',
    'training',
    'maintenance',
    'repair'
];
</script>

<style scoped>
.icon-test {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
}

.icon-item i {
    font-size: 1.5rem;
    color: #333;
}
</style>
