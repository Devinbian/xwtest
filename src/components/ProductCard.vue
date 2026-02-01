<template>
  <div class="product-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="image-container">
      <LazyPicture :src="product.image" :placeholder="generatePlaceholderUrl(product.image)" :alt="product.title" />
      <div class="overlay" :class="{ active: hover }">
        <div class="overlay-actions">
          <router-link to="/products" class="view-details">
            查看产品
          </router-link>
          <button type="button" class="consult-btn" @click.stop="openConsult">
            立即咨询
          </button>
        </div>
      </div>
    </div>
    <div class="product-info">
      <h3 :title="product.title">{{ product.title }}</h3>
      <p class="brand">{{ product.brand }}</p>
      <p class="description">{{ product.description }}</p>
      <div class="consult-hints" aria-label="咨询获取信息">
        <span class="hint-label">咨询获取：</span>
        <span class="hint-item">价格</span>
        <span class="hint-item">交期</span>
        <span class="hint-item">质保</span>
        <span class="hint-item">是否现货</span>
        <span class="hint-item">服务承诺</span>
      </div>
    </div>
  </div>

  <QuoteDialog
    :show="showConsult"
    :product="{ name: product.title, description: product.description }"
    :contextText="consultContextText"
    @close="closeConsult"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { generatePlaceholderUrl } from '@/utils/image';
import LazyPicture from '@/components/LazyPicture.vue';
import QuoteDialog from '@/components/QuoteDialog.vue';

interface ProductProps {
  id: number;
  title: string;
  image: string;
  brand: string;
  description: string;
}

const props = defineProps<{
  product: ProductProps;
}>();

const hover = ref(false);
const showConsult = ref(false);

const consultContextText = computed(() => {
  const lines: string[] = [];
  lines.push('【产品信息】');
  lines.push(`名称：${props.product.title}`);
  lines.push(`品牌：${props.product.brand}`);
  lines.push(`说明：${props.product.description}`);
  lines.push('');
  lines.push('【咨询内容】价格 / 交期 / 质保 / 是否现货 / 服务承诺');
  return lines.join('\n');
});

const openConsult = () => {
  showConsult.value = true;
};

const closeConsult = () => {
  showConsult.value = false;
};
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

    :deep(.lazy-picture) {
      position: absolute;
      inset: 0;
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

      .overlay-actions {
        display: flex;
        gap: var(--space-2);

	        .view-details,
	        .consult-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
	          transition: transform 0.2s ease, opacity 0.2s ease;
	          cursor: pointer;
	        }

	        .view-details {
          color: white;
          text-decoration: none;
          border: 2px solid white;

	          &:hover {
	            background: white;
	            color: black;
	            transform: translateY(-1px);
	          }
	        }

	        .consult-btn {
          background: white;
          border: 2px solid white;
          color: black;

	          &:hover {
	            background: rgba(255, 255, 255, 0.9);
	            transform: translateY(-1px);
	          }
	        }
      }
    }
  }

  .product-info {
    padding: 1rem;

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: calc(1.4em * 1);
    }

    .brand {
      color: #666;
      margin: 0 0 0.5rem;
    }

    .description {
      font-size: 0.9rem;
      margin: 0;
      color: #444;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: calc(1.6em * 2);
    }

    .consult-hints {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 6px;
      margin-top: 0.5rem;
      color: #666;
      font-size: var(--text-xs);
      overflow: hidden;
      min-height: 20px;

      .hint-label {
        font-weight: 600;
        color: #333;
        flex: 0 0 auto;
        white-space: nowrap;
      }

      .hint-item {
        flex: 0 0 auto;
        padding: 1px 8px;
        border-radius: 999px;
        background: rgba(131, 183, 53, 0.08);
        border: 1px solid rgba(131, 183, 53, 0.16);
        color: rgb(111, 162, 46);
        line-height: 1.4;
        white-space: nowrap;
      }

      .hint-item:nth-child(n + 5) {
        display: none;
      }
    }
  }
}
</style>
