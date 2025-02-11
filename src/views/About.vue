<template>
  <div class="about-page">
    <div class="hero" :style="{ backgroundImage: `url(${ASSETS.ABOUT.HERO})` }">
      <h1>关于我们</h1>
      <p>专业的仪器设备供应商，您值得信赖的合作伙伴</p>
    </div>

    <div class="video-section">
      <video 
        :src="ASSETS.ABOUT.VIDEO.URL" 
        :poster="ASSETS.ABOUT.VIDEO.POSTER"
        controls
      ></video>
    </div>

    <div class="content">
      <scroll-reveal>
        <section class="company-intro">
          <h2>公司简介</h2>
          <p>我们是一家专业从事仪器设备销售和技术服务的高科技企业，与全球数十家知名仪器制造商建立了长期稳定的合作关系。二十多年来，我们始终致力于为客户提供最优质的产品和最专业的服务。</p>
          
          <div class="stats">
            <div class="stat-item">
              <div class="number">20+</div>
              <div class="label">年行业经验</div>
            </div>
            <div class="stat-item">
              <div class="number">1000+</div>
              <div class="label">种产品</div>
            </div>
            <div class="stat-item">
              <div class="number">30+</div>
              <div class="label">合作品牌</div>
            </div>
            <div class="stat-item">
              <div class="number">5000+</div>
              <div class="label">客户信赖</div>
            </div>
          </div>
        </section>
      </scroll-reveal>

      <scroll-reveal>
        <section class="advantages">
          <h2>我们的优势</h2>
          <div class="advantage-grid">
            <div class="advantage-item">
              <div class="icon">🌟</div>
              <h3>品牌齐全</h3>
              <p>与全球顶尖仪器制造商深度合作，提供最全面的产品选择</p>
            </div>
            <div class="advantage-item">
              <div class="icon">💯</div>
              <h3>正品保障</h3>
              <p>所有产品均为原厂正品，确保品质</p>
            </div>
            <div class="advantage-item">
              <div class="icon">🛠️</div>
              <h3>技术支持</h3>
              <p>专业的技术团队提供全方位的技术支持和服务</p>
            </div>
            <div class="advantage-item">
              <div class="icon">⚡</div>
              <h3>快速响应</h3>
              <p>24小时响应客户需求，提供及时的解决方案</p>
            </div>
          </div>
        </section>
      </scroll-reveal>

      <scroll-reveal>
        <section class="contact-section">
          <h2>联系我们</h2>
          <div class="contact-info">
            <div class="info-item">
              <div class="icon">📍</div>
              <h3>公司地址</h3>
              <p>上海市浦东新区张江高科技园区</p>
            </div>
            <div class="info-item">
              <div class="icon">📞</div>
              <h3>联系电话</h3>
              <p>400-888-8888</p>
            </div>
            <div class="info-item">
              <div class="icon">📧</div>
              <h3>电子邮箱</h3>
              <p>info@example.com</p>
            </div>
          </div>
        </section>
      </scroll-reveal>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ASSETS } from '@/constants/assets'
</script>

<style scoped lang="scss">
.about-page {
  padding-top: 60px;

  .hero {
    height: 40vh;
    background: linear-gradient(45deg, #2c3e50, #3498db);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 1rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  .video-section {
    margin-bottom: 4rem;
  }

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;

    section {
      margin-bottom: 4rem;

      h2 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #2c3e50;
      }
    }

    .company-intro {
      text-align: center;
      
      p {
        max-width: 800px;
        margin: 0 auto 3rem;
        line-height: 1.8;
        color: #666;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;

        .stat-item {
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 10px;
          
          .number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 0.5rem;
          }

          .label {
            color: #666;
          }
        }
      }
    }

    .advantages {
      .advantage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;

        .advantage-item {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;

          &:hover {
            transform: translateY(-5px);
          }

          .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          h3 {
            margin-bottom: 1rem;
            color: #2c3e50;
          }

          p {
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }

    .contact-section {
      .contact-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;

        .info-item {
          text-align: center;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 10px;

          .icon {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          h3 {
            margin-bottom: 0.5rem;
            color: #2c3e50;
          }

          p {
            color: #666;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about-page {
    .hero {
      height: 30vh;

      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .content {
      padding: 2rem 1rem;

      section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style> 