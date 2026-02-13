<template>
	    <div class="shop">
	        <div class="hero-section">
	            <h1>产品展示</h1>
	            <p>价格/交期/质保/是否现货/服务承诺均需咨询确认</p>
	        </div>

        <div class="container">
            <div class="filters">
                <div class="search-bar">
                    <input type="text" v-model="searchQuery" placeholder="搜索产品..." @input="filterProducts">
                </div>

                <div class="category-filters">
                    <button v-for="category in categories" :key="category.id"
                        :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
                        {{ category.name }}
                    </button>
                </div>
            </div>

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
import { ref, computed } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { getAssetUrl } from '@/utils/assets';

	// 示例数据（展示用：不展示价格，主目标为引导咨询）
const categories = [
    { id: 1, name: '数字万用表/源表' },
    { id: 2, name: '电压/电流源' },
    { id: 3, name: '微电流计/高阻计' },
    { id: 4, name: '示波器' },
    { id: 5, name: '电气安规试验' },
    { id: 6, name: '图像量测' },
    { id: 7, name: '静电测试' },
    { id: 8, name: '环境/材料试验' },
    { id: 9, name: '环境检测' },
    { id: 10, name: '测量工具' },
    { id: 11, name: '理化分析' }
];

		const products = ref([
		    {
		        id: 1,
		        title: 'KEITHLEY 2450',
		        image: getAssetUrl('/images/products/keithley/dmm6500.jpg'),
		        brand: 'KEITHLEY',
		        description: '高精度数字源表',
		        category: 1
		    },
		    {
		        id: 2,
		        title: 'KIKUSUI PWX1500L',
		        image: getAssetUrl('/images/products/keysight/E36106B.png'),
		        brand: 'KIKUSUI',
		        description: '可编程直流电源',
		        category: 2
		    },
		    {
		        id: 3,
		        title: 'ADC 7461',
		        image: getAssetUrl('/images/products/adcmt/7461A.jpg'),
		        brand: 'ADC',
		        description: '高精度数字万用表',
		        category: 1
		    },
		    {
		        id: 4,
		        title: 'RIGOL DM3068',
		        image: getAssetUrl('/images/products/power-analyzer.jpg'),
		        brand: 'RIGOL',
		        description: '6½ 位数字万用表',
		        category: 1
		    },
		    {
		        id: 5,
		        title: 'Tektronix MSO46',
		        image: getAssetUrl('/images/products/tektronix/MSO46.png'),
		        brand: 'Tektronix',
		        description: '混合信号示波器',
		        category: 4
		    },
		    {
		        id: 6,
		        title: 'Keysight DSOX1204G',
		        image: getAssetUrl('/images/products/keysight/34461A.png'),
		        brand: 'Keysight',
		        description: '数字示波器',
		        category: 4
		    },
		    {
		        id: 7,
		        title: 'CHROMA 62000P',
		        image: getAssetUrl('/images/products/power-analyzer.jpg'),
		        brand: 'CHROMA',
		        description: '可编程直流电源',
		        category: 2
		    }
		]);

const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 12;

// 筛选和分页逻辑
const filteredProducts = computed(() => {
    let result = products.value;

    if (selectedCategory.value) {
        result = result.filter(product => product.category === selectedCategory.value);
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }

    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return result.slice(start, end);
});

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / itemsPerPage)
);

// 方法
const selectCategory = (categoryId: number) => {
    selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId;
    currentPage.value = 1;
};

const filterProducts = () => {
    currentPage.value = 1;
};

const changePage = (page: number) => {
    currentPage.value = page;
};
</script>

<style lang="scss" scoped>
.shop {
    padding-top: 80px; // 为固定导航栏留出空间
}

.hero-section {
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
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
