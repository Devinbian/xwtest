<template>
  <div class="about-page">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="container">
        <h1>关于我们</h1>
        <p>专业的仪器设备供应商，您值得信赖的合作伙伴</p>
      </div>
    </div>

    <!-- 公司简介 -->
    <section class="company-intro">
      <div class="container">
        <h2 class="section-title">公司简介</h2>
        <div class="intro-content">
          <div class="text-content">
            <p>
              鑫万测电子科技（苏州）有限公司是集研发、营销、维修于一体的科技型企业。我们致力于使用先进的物联网和大数据技术，打造智能化的微环境系统，为各行业提供智能微环境管控系统解决方案。
            </p>
            <p>
              公司经营销售进口电子测试仪器、环境试验设备、理化分析设备、材料试验设备、图像检测分析设备等，并提供中古设备、售后维修、设备保养、委托性试验、租赁服务等综合服务。
            </p>
            <p>
              我们本着"诚信、公道、务实、求新"的经营原则，"共享、双赢、互利"的经营理念，不懈致力于员工素质之锤炼，为客户提供从进出口设备到售后服务的一站式业务服务。
            </p>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="number">30+</span>
              <span class="label">合作品牌</span>
            </div>
            <div class="stat-item">
              <span class="number">1000+</span>
              <span class="label">产品型号</span>
            </div>
            <div class="stat-item">
              <span class="number">100%</span>
              <span class="label">原厂正品</span>
            </div>
            <div class="stat-item">
              <span class="number">24h</span>
              <span class="label">技术支持</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 我们的优势 -->
    <section class="advantages">
      <div class="container">
        <h2 class="section-title">我们的优势</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="card-content">
              <div class="icon-wrapper">
                <i class="fas fa-tools"></i>
              </div>
              <div class="text-content">
                <h3>一站式服务</h3>
                <p>从设备销售到售后维修</p>
              </div>
            </div>
            <div class="hover-content">
              <ul>
                <li>设备销售与采购</li>
                <li>技术咨询服务</li>
                <li>设备维修保养</li>
                <li>租赁与回购</li>
              </ul>
            </div>
          </div>
          <div class="advantage-card">
            <div class="card-content">
              <div class="icon-wrapper">
                <i class="fas fa-certificate"></i>
              </div>
              <div class="text-content">
                <h3>品牌齐全</h3>
                <p>代理数十个国际品牌</p>
              </div>
            </div>
            <div class="hover-content">
              <ul>
                <li>代理数十个国际品牌</li>
                <li>产品选择丰富</li>
              </ul>
            </div>
          </div>
          <div class="advantage-card">
            <div class="card-content">
              <div class="icon-wrapper">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="text-content">
                <h3>技术支持</h3>
                <p>专业维修保养服务</p>
              </div>
            </div>
            <div class="hover-content">
              <ul>
                <li>专业维修团队</li>
                <li>设备维修保养</li>
              </ul>
            </div>
          </div>
          <div class="advantage-card">
            <div class="card-content">
              <div class="icon-wrapper">
                <i class="fas fa-sync-alt"></i>
              </div>
              <div class="text-content">
                <h3>增值服务</h3>
                <p>租赁回购与处置</p>
              </div>
            </div>
            <div class="hover-content">
              <ul>
                <li>设备租赁服务</li>
                <li>回购及报废处置</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作品牌 -->
    <section class="partner-brands">
      <div class="container">
        <h2 class="section-title">合作品牌</h2>
        <div class="brands-wrapper">
          <div class="brands-scroll">
            <div class="brands-grid">
              <div
                v-for="brand in displayedBrands"
                :key="brand.name"
                class="brand-card"
              >
                <div class="brand-logo">
                  <img :src="brand.logo" :alt="brand.name" />
                </div>
                <div class="brand-info">
                  <h3>{{ brand.name }}</h3>
                  <p>{{ brand.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <button
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact-us">
      <div class="container">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-content">
          <div class="contact-grid">
            <div class="contact-item primary">
              <div class="item-content">
                <div class="left-content">
                  <div class="icon-wrapper">
                    <i class="fas fa-comments"></i>
                  </div>
                  <div class="text">
                    <h3>在线咨询</h3>
                    <p>扫码添加客服微信，获取更多产品信息</p>
                    <p class="time">工作时间：周一至周五 9:00-18:00</p>
                  </div>
                </div>
                <div class="qrcode-wrapper">
                  <img
                    :src="getAssetUrl('/images/qrcode.png')"
                    alt="微信二维码"
                  />
                </div>
              </div>
              <div class="decoration">
                <i class="fas fa-circle"></i>
                <i class="fas fa-square"></i>
                <i class="fas fa-diamond"></i>
              </div>
            </div>

            <div class="contact-item">
              <div class="item-content">
                <div class="icon-wrapper">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div class="text">
                  <h3>电话咨询</h3>
                  <p class="phone">186-6258-5852</p>
                </div>
              </div>
            </div>

            <div class="contact-item">
              <div class="item-content">
                <div class="icon-wrapper">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="text">
                  <h3>邮件咨询</h3>
                  <p>sales@xwtest.com.cn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { partners } from '../data/home/partners.js';
import { getAssetUrl } from '@/utils/assets';
// 分页相关
const currentPage = ref(1);
const brandsPerPage = 12; // 每页显示12个品牌

const totalPages = computed(() => Math.ceil(partners.length / brandsPerPage));

const displayedBrands = computed(() => {
  const start = (currentPage.value - 1) * brandsPerPage;
  const end = start + brandsPerPage;
  return partners.slice(start, end);
});

const changePage = (page: number) => {
  currentPage.value = page;
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../styles/variables' as vars;

.about-page {
  padding-top: calc(var(--top-bar-height) + var(--nav-height));
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// 页面标题区域
.page-header {
  background: linear-gradient(
    135deg,
    color.adjust(vars.$primary-green, $lightness: -10%),
    vars.$primary-green
  );
  color: white;
  padding: 4rem 0;
  margin-bottom: 4rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

// 通用section样式
section {
  padding: 4rem 0;

  &:nth-child(even) {
    background: #f8f9fa;
  }
}

// 通用标题样式
.section-title {
  text-align: center;
  font-size: 2rem;
  color: vars.$primary-black;
  margin-bottom: 3rem;
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: vars.$primary-green;
    border-radius: 2px;
  }
}

// 公司简介样式
.company-intro {
  .intro-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .text-content {
      p {
        margin-bottom: 1.5rem;
        line-height: 1.8;
        color: #666;
        font-size: 1.1rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;

      .stat-item {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .number {
          display: block;
          font-size: 2.5rem;
          font-weight: 600;
          color: vars.$primary-green;
          margin-bottom: 0.5rem;
        }

        .label {
          color: #666;
          font-size: 1.1rem;
        }
      }
    }
  }
}

// 我们的优势样式
.advantages {
  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }

    .advantage-card {
      position: relative;
      height: 280px;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

        .hover-content {
          opacity: 1;
          transform: translateY(0);
        }

        .card-content {
          opacity: 0;
        }
      }

      .card-content {
        position: absolute;
        inset: 0;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.3s ease;
        background: white;

        .icon-wrapper {
          width: 70px;
          height: 70px;
          margin-bottom: 1.5rem;
          background: rgba(vars.$primary-green, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 1.8rem;
            color: vars.$primary-green;
          }
        }

        h3 {
          font-size: 1.2rem;
          color: vars.$primary-black;
          margin-bottom: 0.8rem;
        }

        p {
          color: #666;
          line-height: 1.6;
          font-size: 0.9rem;
        }
      }

      .hover-content {
        position: absolute;
        inset: 0;
        padding: 2rem;
        background: vars.$primary-green;
        color: white;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin-bottom: 1rem;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            &::before {
              content: '•';
              color: rgba(255, 255, 255, 0.7);
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}

// 合作品牌样式
.partner-brands {
  .brands-wrapper {
    .brands-scroll {
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      transition: all 0.3s ease;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .brand-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

        .brand-logo img {
          transform: scale(1.05);
        }
      }

      .brand-logo {
        height: 60px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;

        img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
      }

      .brand-info {
        text-align: center;

        h3 {
          font-size: 1rem;
          color: vars.$primary-black;
          margin-bottom: 0.5rem;
        }

        p {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;

    button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: #f5f5f5;
      color: #666;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(vars.$primary-green, 0.1);
        color: vars.$primary-green;
      }

      &.active {
        background: vars.$primary-green;
        color: white;
      }
    }
  }
}

// 联系我们样式
.contact-us {
  .contact-content {
    max-width: 1000px;
    margin: 0 auto;

    .contact-grid {
      display: grid;
      grid-template-areas:
        'primary primary'
        'phone email';
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-areas:
          'primary'
          'phone'
          'email';
      }

      .contact-item {
        position: relative;
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        transition: all 0.3s ease;

        &.primary {
          grid-area: primary;
          background: linear-gradient(
            135deg,
            rgba(vars.$primary-green, 0.95),
            color.adjust(vars.$primary-green, $lightness: -15%)
          );
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.18) 0,
              rgba(255, 255, 255, 0.18) 2px,
              transparent 2px,
              transparent 10px
            );
            opacity: 0.1;
            mix-blend-mode: overlay;
          }

          .item-content {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 3rem;

            @media (max-width: 768px) {
              flex-direction: column;
              gap: 2rem;
            }

            .left-content {
              display: flex;
              align-items: center;
              gap: 2rem;
              flex: 1;

              .icon-wrapper {
                width: 70px;
                height: 70px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);

                i {
                  font-size: 1.8rem;
                  color: white;
                }
              }

              .text {
                h3 {
                  font-size: 1.5rem;
                  color: white;
                  margin-bottom: 1rem;
                }

                p {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 1.1rem;
                  margin-bottom: 0.5rem;
                }

                .time {
                  color: rgba(255, 255, 255, 0.7);
                  font-size: 0.9rem;
                }
              }
            }

            .qrcode-wrapper {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 1.5rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              transition: all 0.3s ease;

              &:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.15);
              }

              img {
                width: 140px;
                height: 140px;
                border-radius: 12px;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
              }
            }
          }
        }

        &:nth-child(2) {
          grid-area: phone;
        }

        &:nth-child(3) {
          grid-area: email;
        }

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .item-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          background: rgba(vars.$primary-green, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          i {
            font-size: 1.5rem;
            color: vars.$primary-green;
          }
        }

        .text {
          flex: 1;

          h3 {
            font-size: 1.2rem;
            color: vars.$primary-black;
            margin-bottom: 0.5rem;
          }

          p {
            color: #666;
            line-height: 1.6;

            &.phone {
              font-size: 1.2rem;
              font-weight: 500;
              color: vars.$primary-green;
            }
          }
        }

        .decoration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;

          i {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            transition: all 0.5s ease;

            &.fa-circle {
              font-size: 20rem;
              top: -50%;
              right: -20%;
              transform: rotate(-30deg);
            }

            &.fa-square {
              font-size: 15rem;
              bottom: -30%;
              left: -10%;
              transform: rotate(20deg);
            }

            &.fa-diamond {
              font-size: 12rem;
              top: 20%;
              left: 50%;
              transform: rotate(45deg);
            }
          }
        }

        &:hover {
          .decoration i {
            transform: scale(1.1) rotate(0deg);
          }
        }
      }
    }
  }
}

.partners-section {
  padding: 2rem 0;
  text-align: center;
}

.partners-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.partner-item {
  width: 150px;
  text-align: center;
}

.partner-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.partner-item p {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #333;
}
</style>
