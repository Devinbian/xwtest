<template>
	    <div class="shop">
	        <div class="hero-section">
	            <h1>产品展示</h1>
	            <p>价格/交期/质保/是否现货/服务承诺均需咨询确认</p>
	        </div>

        <div class="container">
            <div class="filters">
                <div class="search-bar">
                    <input type="text" v-model="searchQuery" placeholder="搜索产品..." aria-label="搜索产品">
                </div>

                <div class="category-filters">
                    <button v-for="category in categories" :key="category.id"
                        :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
                        {{ category.name }}
                    </button>
                </div>
            </div>

            <p v-if="!matchingProducts.length" role="status">暂无匹配产品，请尝试其他关键词或分类。</p>
            <div class="products-grid">
                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
            </div>

            <div class="pagination" v-if="totalPages > 1">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                    上一页
                </button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                    下一页
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { categories } from '@/data/products/categories.js';
import { products } from '@/data/products/products.js';

const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 12;

const matchingProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return products.filter(product => {
    if (selectedCategory.value && product.categoryId !== selectedCategory.value) return false;
    return [product.name, product.brandDisplay, product.brand, product.description]
      .some(value => value.toLowerCase().includes(query));
  });
});

const totalPages = computed(() => Math.ceil(matchingProducts.value.length / itemsPerPage));
const filteredProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return matchingProducts.value.slice(start, start + itemsPerPage).map(product => ({
    ...product,
    title: product.name,
    brand: product.brandDisplay || product.brand,
  }));
});

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
}, { flush: 'sync' });

const selectCategory = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId;
};

const changePage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value));
};
</script>

<style lang="scss" scoped>
.shop {
    padding-top: 80px; // 为固定导航栏留出空间
}

.hero-section {
    background: var(--surface-banner);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    margin-bottom: 2rem;

    h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.2rem;
        opacity: 0.9;
    }
}

.filters {
    margin-bottom: 2rem;

    .search-bar {
        margin-bottom: 1rem;

        input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;

            &:focus {
                outline: none;
                border-color: var(--primary-color);
            }
        }
    }

    .category-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        button {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: white;
            cursor: pointer;
            transition: transform 0.3s ease, opacity 0.3s ease;

            &:hover {
                background: #f5f5f5;
            }

            &.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
        }
    }
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-bottom: 2rem;

    button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        transition: transform 0.3s ease, opacity 0.3s ease;

        &:hover:not(:disabled) {
            background: var(--primary-color);
            color: white;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    span {
        font-size: 0.9rem;
        color: #666;
    }
}

@media (max-width: 768px) {
    .hero-section {
        padding: 3rem 1rem;

        h1 {
            font-size: 2rem;
        }

        p {
            font-size: 1rem;
        }
    }

    .category-filters {
        button {
            font-size: 0.9rem;
        }
    }
}
</style>
