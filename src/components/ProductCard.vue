<template>
  <div class="product-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="image-container">
      <img :src="placeholderImage" :alt="product.title">
      <div class="overlay" :class="{ active: hover }">
        <router-link :to="`/products/${product.id}`" class="view-details">
          查看详情
        </router-link>
      </div>
    </div>
    <div class="product-info">
      <h3>{{ product.title }}</h3>
      <p class="brand">{{ product.brand }}</p>
      <p class="description">{{ product.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { generatePlaceholderUrl } from '@/utils/image';

interface ProductProps {
  id: number;
  title: string;
  image: string;
  brand: string;
  description: string;
}

defineProps<{
  product: ProductProps;
}>();

const hover = ref(false);

const placeholderImage = generatePlaceholderUrl(props.product.image);
console.log("placeholderImage:"+placeholderImage);
</script>

<style lang="scss" scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .image-container {
    position: relative;
    padding-top: 75%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.active {
        opacity: 1;
      }

      .view-details {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border: 2px solid white;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background: white;
          color: black;
        }
      }
    }
  }

  .product-info {
    padding: 1rem;

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }

    .brand {
      color: #666;
      margin: 0 0 0.5rem;
    }

    .description {
      font-size: 0.9rem;
      margin: 0;
      color: #444;
    }
  }
}
</style>
