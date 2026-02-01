<template>
  <div class="contact-page">
    <div class="page-hero">
      <div class="container">
        <h1>联系我们</h1>
        <p>专业的仪器设备供应商，您值得信赖的合作伙伴</p>
      </div>
    </div>

    <div class="container">
      <section class="contact-content">
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
                <img :src="getAssetUrl('/images/qrcode.png')" alt="微信二维码" loading="lazy" decoding="async">
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
                <p class="phone"><a href="tel:186-6258-5852">186-6258-5852</a></p>
                <p class="sub-text">工作时间：周一至周五 9:00-18:00</p>
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
                <p><a href="mailto:sales@xwtest.com.cn">sales@xwtest.com.cn</a></p>
                <p class="sub-text">我们会在24小时内回复您</p>
              </div>
            </div>
          </div>
        </div>

        <div class="company-info">
          <h2>鑫万测电子科技（苏州）有限公司</h2>
          <p>我们是集研发、营销、维修于一体的科技型企业，致力于使用先进的物联网和大数据技术，打造智能化的微环境系统，为各行业提供智能微环境管控系统解决方案。</p>
          <p>公司经营销售进口电子测试仪器、环境试验设备、理化分析设备、材料试验设备、图像检测分析设备等，并提供中古设备、售后维修、设备保养、委托性试验、租赁服务等综合服务。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssetUrl } from '@/utils/assets'
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-green: #83B735;
$primary-black: #333;

.contact-page {
  min-height: calc(100vh - 80px);
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-hero {
  background: linear-gradient(135deg, color.adjust($primary-green, $lightness: -10%), $primary-green);
  color: white;
  padding: 4rem 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.contact-content {
  padding: 4rem 0;
}

.contact-grid {
  display: grid;
  grid-template-areas:
    "primary primary"
    "phone email";
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-areas:
      "primary"
      "phone"
      "email";
  }

  .contact-item {
    position: relative;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &.primary {
      grid-area: primary;
      background: linear-gradient(135deg,
          rgba($primary-green, 0.95),
          color.adjust($primary-green, $lightness: -15%));
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          repeating-linear-gradient(
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
            display: flex;
            align-items: center;
            justify-content: center;

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
          transition: transform 0.3s ease, opacity 0.3s ease;

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
      background: rgba($primary-green, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, opacity 0.3s ease;

      i {
        font-size: 1.5rem;
        color: $primary-green;
      }
    }

    .text {
      flex: 1;

      h3 {
        font-size: 1.2rem;
        color: $primary-black;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 0.25rem;

        a {
          color: $primary-green;
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }

        &.phone {
          font-size: 1.2rem;
          font-weight: 500;

          a {
            color: $primary-green;
          }
        }
      }

      .sub-text {
        font-size: 0.9rem;
        color: #999;
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
        transition: transform 0.5s ease, opacity 0.5s ease;

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

.company-info {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  h2 {
    font-size: 1.8rem;
    color: $primary-black;
    margin-bottom: 1.5rem;
  }

  p {
    color: #666;
    line-height: 1.8;
    font-size: 1.05rem;
    margin-bottom: 1rem;
    text-align: left;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .contact-content {
    padding: 3rem 1rem;
  }

  .company-info {
    padding: 2rem 1.5rem;

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style>
