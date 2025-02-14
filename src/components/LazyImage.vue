<template>
    <div class="lazy-image" :class="{ loaded: isLoaded }">
        <!-- 低质量图片预览 -->
        <img v-if="placeholder" :src="placeholder" :alt="alt" class="placeholder-image" />
        <!-- 加载动画 -->
        <div v-if="!isLoaded" class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <!-- 实际图片 -->
        <img :src="src" :alt="alt" class="main-image" @load="onImageLoaded" loading="lazy" decoding="async" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    src: string;
    alt: string;
    placeholder?: string;
}

const props = defineProps<Props>();
const isLoaded = ref(false);

const onImageLoaded = () => {
    isLoaded.value = true;
};
</script>

<style lang="scss" scoped>
.lazy-image {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;

    .placeholder-image,
    .main-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder-image {
        filter: blur(10px);
        transform: scale(1.1);
        opacity: 1;
        transition: opacity 0.3s ease;
    }

    .main-image {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(0, 0, 0, 0.5);
        font-size: 1.5rem;
    }

    &.loaded {
        .placeholder-image {
            opacity: 0;
        }

        .main-image {
            opacity: 1;
        }

        .loading-spinner {
            display: none;
        }
    }
}
</style>
