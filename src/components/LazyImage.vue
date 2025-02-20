<template>
    <div class="lazy-image" :class="{ loading: !isLoaded, error: hasError }">
        <!-- 低质量图片预览 -->
        <img v-if="!isLoaded && placeholder" :src="placeholder" :alt="alt" class="placeholder" />
        <!-- 加载动画 -->
        <div v-if="!isLoaded" class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <!-- 实际图片 -->
        <img :src="src" :alt="alt" class="main-image" @load="handleLoad" @error="handleError" :style="{ opacity: isLoaded ? 1 : 0 }" />
        <div v-if="hasError" class="error-placeholder">
            <i class="fas fa-image"></i>
            <span>图片加载失败</span>
        </div>
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
const hasError = ref(false);

const handleLoad = () => {
    isLoaded.value = true;
};

const handleError = () => {
    hasError.value = true;
};
</script>

<style lang="scss" scoped>
.lazy-image {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;

    .placeholder {
        position: absolute;
        top: 0;
        left: 0;
        filter: blur(10px);
    }

    .main-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    .error-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        color: #999;

        i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
    }

    &.loaded {
        .placeholder {
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
