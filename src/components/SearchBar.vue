<template>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchQuery"
      placeholder="搜索产品或品牌..."
      @focus="showSuggestions = true"
      @blur="hideSuggestionsDelayed"
    >
    <div class="search-icon">🔍</div>
    
    <div class="suggestions" v-if="showSuggestions && filteredResults.length > 0">
      <div 
        v-for="result in filteredResults" 
        :key="result.id"
        class="suggestion-item"
        @mousedown="handleSelect(result)"
      >
        <img :src="result.image" :alt="result.name">
        <div class="suggestion-info">
          <div class="name">{{ result.name }}</div>
          <div class="category">{{ result.category }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showSuggestions = ref(false)

// 这里可以从 store 或 API 获取数据
const allProducts = [
  {
    id: 1,
    name: 'MSO46 示波器',
    category: '示波器',
    image: 'https://www.tek.com/content/dam/tektronix/images/products/oscilloscopes/4-series-mso/hero.png'
  },
  // ... 更多产品
]

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  return allProducts.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5)
})

const hideSuggestionsDelayed = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleSelect = (result: typeof allProducts[0]) => {
  router.push({
    path: '/products',
    query: { 
      search: result.name,
      category: result.category
    }
  })
  showSuggestions.value = false
}
</script>

<style scoped lang="scss">
.search-bar {
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 0.8rem 2.5rem 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
  }

  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow: hidden;

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 0.8rem;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: #f8f9fa;
      }

      img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        margin-right: 1rem;
      }

      .suggestion-info {
        .name {
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        .category {
          font-size: 0.9rem;
          color: #666;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .search-bar {
    width: 100%;
  }
}
</style> 