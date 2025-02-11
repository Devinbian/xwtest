<template>
  <div class="product-detail">
    <div class="product-hero">
      <div class="container">
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
        </div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <div class="brand">{{ product.brand }}</div>
          <div class="category">{{ product.category }}</div>
          <p class="description">{{ product.description }}</p>
          <div class="features">
            <h2>主要特点</h2>
            <ul>
              <li v-for="feature in product.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
          <div class="actions">
            <button class="primary">获取报价</button>
            <button class="secondary">下载资料</button>
          </div>
        </div>
      </div>
    </div>

    <div class="product-content">
      <div class="container">
        <div class="specs">
          <h2>技术规格</h2>
          <table>
            <tr v-for="(value, key) in product.specifications" :key="key">
              <td class="spec-name">{{ key }}</td>
              <td class="spec-value">{{ value }}</td>
            </tr>
          </table>
        </div>

        <div class="related-products">
          <h2>相关产品</h2>
          <div class="products-grid">
            <div 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id"
              class="product-card"
              @click="router.push(`/products/${relatedProduct.id}`)"
            >
              <img :src="relatedProduct.image" :alt="relatedProduct.name">
              <div class="card-info">
                <h3>{{ relatedProduct.name }}</h3>
                <p>{{ relatedProduct.brand }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 模拟产品数据
const product = ref({
  id: 1,
  name: 'MSO46 示波器',
  brand: 'Tektronix',
  category: '示波器',
  description: '高性能混合信号示波器，提供卓越的信号完整性和实时测量功能。',
  image: 'https://www.tek.com/content/dam/tektronix/images/products/oscilloscopes/4-series-mso/hero.png',
  features: [
    '6 GHz 带宽',
    '4 个模拟通道',
    '16 个数字通道',
    '高达 25 GS/s 采样率',
    '高达 1 G 记录长度'
  ],
  specifications: {
    '带宽': '6 GHz',
    '通道数': '4',
    '采样率': '25 GS/s',
    '记录长度': '1 G',
    '垂直分辨率': '12 位'
  }
})

const relatedProducts = ref([
  {
    id: 2,
    name: 'TBS2000B 示波器',
    brand: 'Tektronix',
    image: 'https://www.tek.com/content/dam/tektronix/images/products/oscilloscopes/tbs2000b/hero.png'
  },
  // ... 更多相关产品
])

onMounted(() => {
  // 这里可以根据路由参数加载实际产品数据
  const productId = route.params.id
  // loadProductData(productId)
})
</script>

<style scoped lang="scss">
.product-detail {
  padding-top: 60px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .product-hero {
    background: #f8f9fa;
    padding: 4rem 0;

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      .product-image {
        img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
      }

      .product-info {
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .brand {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .category {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 20px;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .features {
          margin-bottom: 2rem;

          h2 {
            margin-bottom: 1rem;
          }

          ul {
            list-style: none;
            padding: 0;

            li {
              padding: 0.5rem 0;
              padding-left: 1.5rem;
              position: relative;

              &::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #2ecc71;
              }
            }
          }
        }

        .actions {
          display: flex;
          gap: 1rem;

          button {
            padding: 1rem 2rem;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;

            &.primary {
              background: #3498db;
              color: white;
              border: none;

              &:hover {
                background: #2980b9;
              }
            }

            &.secondary {
              background: white;
              border: 1px solid #3498db;
              color: #3498db;

              &:hover {
                background: #f8f9fa;
              }
            }
          }
        }
      }
    }
  }

  .product-content {
    padding: 4rem 0;

    .specs {
      margin-bottom: 4rem;

      h2 {
        margin-bottom: 2rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;

        tr {
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }

          td {
            padding: 1rem;

            &.spec-name {
              font-weight: 500;
              width: 200px;
              background: #f8f9fa;
            }
          }
        }
      }
    }

    .related-products {
      h2 {
        margin-bottom: 2rem;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;

        .product-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.3s;

          &:hover {
            transform: translateY(-5px);
          }

          img {
            width: 100%;
            height: 200px;
            object-fit: contain;
            background: #f8f9fa;
          }

          .card-info {
            padding: 1rem;

            h3 {
              margin-bottom: 0.5rem;
            }

            p {
              color: #666;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .product-detail {
    .product-hero {
      .container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .container {
      padding: 0 1rem;
    }
  }
}
</style> 