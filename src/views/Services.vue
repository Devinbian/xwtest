<template>
  <div class="services-page">
    <!-- Hero Banner -->
    <div class="page-hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="hero-pattern"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">我们的服务</h1>
          <p class="hero-subtitle">专业团队为您提供完整的技术支持与服务</p>
          <div class="hero-features">
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>专业团队</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>快速响应</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>全程跟踪</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务内容 -->
    <div class="container">
      <section class="services-section">
        <div class="section-header">
          <h2 class="section-title">核心服务</h2>
          <p class="section-subtitle">为您提供全方位的专业服务支持</p>
        </div>

        <div class="services-grid">
          <div v-for="(service, index) in services" :key="service.id" class="service-card" :class="`card-${index + 1}`">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="service-icon">
                <i :class="service.icon"></i>
              </div>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <ul class="service-features">
                <li v-for="(feature, idx) in service.features" :key="idx">
                  <i class="fas fa-chevron-right"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
            <div class="card-decoration">
              <div class="decoration-circle"></div>
              <div class="decoration-line"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 服务流程 -->
      <section class="process-section">
        <div class="section-header">
          <h2 class="section-title">服务流程</h2>
          <p class="section-subtitle">标准化流程，确保服务质量</p>
        </div>

        <div class="process-timeline">
          <div v-for="(step, index) in processSteps" :key="index" class="process-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>
            <div v-if="index < processSteps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </section>

      <!-- 服务承诺 -->
      <section class="commitment-section">
        <div class="commitment-card">
          <div class="commitment-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="commitment-content">
            <h3>我们的承诺</h3>
            <div class="commitment-list">
              <div class="commitment-item">
                <i class="fas fa-clock"></i>
                <span>7×24小时技术支持</span>
              </div>
              <div class="commitment-item">
                <i class="fas fa-user-check"></i>
                <span>专业工程师团队</span>
              </div>
              <div class="commitment-item">
                <i class="fas fa-thumbs-up"></i>
                <span>100%客户满意度</span>
              </div>
              <div class="commitment-item">
                <i class="fas fa-award"></i>
                <span>原厂认证服务</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const services = ref([
  {
    id: 1,
    title: '技术咨询',
    description: '提供专业的仪器选型、方案设计等技术咨询服务',
    icon: 'fas fa-comments',
    features: ['设备选型建议', '方案设计优化', '技术参数分析', '成本效益评估']
  },
  {
    id: 2,
    title: '安装调试',
    description: '专业工程师上门安装调试，确保设备正常运行',
    icon: 'fas fa-tools',
    features: ['现场安装部署', '系统调试优化', '功能测试验证', '操作培训指导']
  },
  {
    id: 3,
    title: '培训服务',
    description: '提供设备操作培训，让您快速掌握使用技巧',
    icon: 'fas fa-graduation-cap',
    features: ['基础操作培训', '高级功能讲解', '故障排查指导', '定期技术交流']
  },
  {
    id: 4,
    title: '维修保养',
    description: '定期维护保养，延长设备使用寿命',
    icon: 'fas fa-wrench',
    features: ['定期巡检维护', '故障快速响应', '零部件更换', '性能优化升级']
  },
  {
    id: 5,
    title: '技术支持',
    description: '7×24小时技术支持热线，随时解决您的问题',
    icon: 'fas fa-headset',
    features: ['在线技术咨询', '远程故障诊断', '应急响应服务', '技术文档支持']
  },
  {
    id: 6,
    title: '备件供应',
    description: '提供原厂备件，保证设备持续稳定运行',
    icon: 'fas fa-box',
    features: ['原厂配件供应', '快速物流配送', '库存充足保障', '质量认证保证']
  }
])

const processSteps = ref([
  {
    title: '需求沟通',
    description: '了解客户需求，制定服务方案'
  },
  {
    title: '方案确认',
    description: '确认服务内容，签订服务协议'
  },
  {
    title: '服务实施',
    description: '专业团队执行服务，全程跟踪'
  },
  {
    title: '质量验收',
    description: '客户验收确认，确保服务质量'
  },
  {
    title: '售后跟踪',
    description: '定期回访跟踪，持续优化服务'
  }
])
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-green: #83B735;
$primary-black: #333;

.services-page {
  min-height: calc(100vh - 80px);
  padding-top: calc(var(--top-bar-height) + var(--nav-height));
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Hero Banner
.page-hero {
  position: relative;
  background: linear-gradient(135deg, color.adjust($primary-green, $lightness: -10%), $primary-green);
  color: white;
  padding: 5rem 0;
  overflow: hidden;

  .hero-background {
    position: absolute;
    inset: 0;
    z-index: 0;

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg,
        rgba($primary-green, 0.95) 0%,
        rgba(color.adjust($primary-green, $lightness: -15%), 0.9) 100%);
    }

    .hero-pattern {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    }
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
  }

  .hero-subtitle {
    font-size: 1.4rem;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  .hero-features {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.1rem;
      font-weight: 500;

      i {
        font-size: 1.3rem;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

// 服务内容
.services-section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;

  .section-title {
    font-size: 2.5rem;
    color: $primary-black;
    margin-bottom: 1rem;
    font-weight: 700;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -0.8rem;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, transparent, $primary-green, transparent);
      border-radius: 2px;
    }
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-top: 2rem;
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.service-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary-green, color.adjust($primary-green, $lightness: 15%));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

    &::before {
      transform: scaleX(1);
    }

    .service-icon {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, $primary-green, color.adjust($primary-green, $lightness: 15%));
    }

    .card-decoration {
      opacity: 1;

      .decoration-circle {
        transform: scale(1.2);
      }
    }
  }

  .card-content {
    position: relative;
    z-index: 2;
  }

  .service-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba($primary-green, 0.1), rgba($primary-green, 0.05));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    transition: all 0.4s ease;

    i {
      font-size: 2rem;
      color: $primary-green;
    }
  }

  .service-title {
    font-size: 1.5rem;
    color: $primary-black;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .service-description {
    color: #666;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
  }

  .service-features {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.6rem 0;
      color: #555;
      font-size: 0.95rem;

      i {
        color: $primary-green;
        font-size: 0.8rem;
      }
    }
  }

  .card-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    opacity: 0.3;
    transition: opacity 0.4s ease;
    pointer-events: none;

    .decoration-circle {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($primary-green, 0.1), transparent);
      transition: transform 0.4s ease;
    }

    .decoration-line {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, $primary-green, transparent);
      transform: rotate(-45deg);
    }
  }
}

// 服务流程
.process-section {
  padding: 5rem 0;
  background: white;
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.process-timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
}

.process-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  .step-number {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, $primary-green, color.adjust($primary-green, $lightness: 15%));
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba($primary-green, 0.3);
    position: relative;
    z-index: 2;
  }

  .step-content {
    h4 {
      font-size: 1.2rem;
      color: $primary-black;
      margin-bottom: 0.8rem;
      font-weight: 600;
    }

    p {
      color: #666;
      line-height: 1.6;
      font-size: 0.95rem;
    }
  }

  .step-connector {
    position: absolute;
    top: 30px;
    left: calc(50% + 30px);
    width: calc(100% - 60px);
    height: 2px;
    background: linear-gradient(90deg, $primary-green, color.adjust($primary-green, $lightness: 20%));
    z-index: 1;

    @media (max-width: 768px) {
      display: none;
    }
  }
}

// 服务承诺
.commitment-section {
  padding: 5rem 0;
}

.commitment-card {
  background: linear-gradient(135deg,
    rgba($primary-green, 0.05) 0%,
    rgba($primary-green, 0.02) 100%);
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }

  .commitment-icon {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, $primary-green, color.adjust($primary-green, $lightness: 15%));
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 8px 30px rgba($primary-green, 0.3);

    i {
      font-size: 3rem;
      color: white;
    }
  }

  .commitment-content {
    flex: 1;

    h3 {
      font-size: 2rem;
      color: $primary-black;
      margin-bottom: 2rem;
      font-weight: 700;
    }

    .commitment-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .commitment-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      i {
        font-size: 1.5rem;
        color: $primary-green;
      }

      span {
        color: #555;
        font-weight: 500;
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 0;

    .hero-title {
      font-size: 2.2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-features {
      gap: 1.5rem;

      .feature-item {
        font-size: 1rem;
      }
    }
  }

  .section-header {
    .section-title {
      font-size: 2rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .commitment-card {
    padding: 2rem;

    .commitment-icon {
      width: 100px;
      height: 100px;

      i {
        font-size: 2.5rem;
      }
    }

    .commitment-content {
      h3 {
        font-size: 1.5rem;
      }

      .commitment-list {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
