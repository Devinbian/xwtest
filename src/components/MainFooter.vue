<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <img :src="ASSETS.BASE.LOGO.DARK" alt="Logo" class="footer-logo">
          <p class="company-desc">
            专业的测试测量设备供应商，为您提供世界顶级仪器设备解决方案
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <img :src="ASSETS.BASE.ICONS.SOCIAL.WECHAT" alt="WeChat">
            </a>
            <a href="#" class="social-link">
              <img :src="ASSETS.BASE.ICONS.SOCIAL.LINKEDIN" alt="LinkedIn">
            </a>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h3>产品中心</h3>
            <ul>
              <li><router-link to="/products?category=oscilloscopes">示波器</router-link></li>
              <li><router-link to="/products?category=power-supplies">电源</router-link></li>
              <li><router-link to="/products?category=multimeters">万用表</router-link></li>
              <li><router-link to="/products?category=signal-generators">信号发生器</router-link></li>
            </ul>
          </div>

          <div class="link-group">
            <h3>合作品牌</h3>
            <ul>
              <li><router-link to="/brands/keysight">是德科技</router-link></li>
              <li><router-link to="/brands/tektronix">泰克</router-link></li>
              <li><router-link to="/brands/fluke">福禄克</router-link></li>
              <li><router-link to="/brands">更多品牌</router-link></li>
            </ul>
          </div>

          <div class="link-group">
            <h3>关于我们</h3>
            <ul>
              <li><router-link to="/about">公司简介</router-link></li>
              <li><router-link to="/contact">联系我们</router-link></li>
              <li><router-link to="/careers">招贤纳士</router-link></li>
              <li><router-link to="/news">新闻动态</router-link></li>
            </ul>
          </div>

          <div class="link-group contact-info">
            <h3>联系方式</h3>
            <ul>
              <li>
                <i class="icon">📞</i>
                <span>18112550622</span>
              </li>
              <li>
                <i class="icon">✉️</i>
                <span>sales@xwtest.com.cn</span>
              </li>
              <li>
                <i class="icon">📍</i>
                <span>上海市浦东新区张江高科技园区</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          © {{ new Date().getFullYear() }} 仪器设备公司. 保留所有权利.
        </div>
        <div class="bottom-links">
          <router-link to="/privacy">隐私政策</router-link>
          <router-link to="/terms">使用条款</router-link>
          <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备xxxxxxxx号-1</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ASSETS } from '@/constants/assets';
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as mix;

.main-footer {
  background-color: vars.$primary-dark;
  color: white;
  padding: 4rem 0 0;
  margin-top: 6rem;

  .footer-content {
    @include mix.container;
  }

  .footer-main {
    display: grid;
    grid-template-columns: 1.5fr 3fr;
    gap: 4rem;
    padding-bottom: 4rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-brand {
    .footer-logo {
      height: 40px;
      width: auto;
      margin-bottom: 1.5rem;
    }

    .company-desc {
      color: vars.$gray-400;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transition: vars.$transition-normal;

        img {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
        }

        &:hover {
          background: vars.$primary-green;
          transform: translateY(-2px);
        }
      }
    }
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    .link-group {
      h3 {
        color: white;
        font-size: vars.$font-size-lg;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 1rem;

          a {
            color: vars.$gray-400;
            text-decoration: none;
            transition: vars.$transition-normal;

            &:hover {
              color: vars.$primary-green;
            }
          }
        }
      }

      &.contact-info {
        li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: vars.$gray-400;

          .icon {
            font-size: 1.25rem;
          }
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
    color: vars.$gray-500;
    font-size: vars.$font-size-sm;

    .bottom-links {
      display: flex;
      gap: 2rem;

      a {
        color: vars.$gray-500;
        text-decoration: none;
        transition: vars.$transition-normal;

        &:hover {
          color: vars.$primary-green;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .main-footer {
    .footer-main {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .footer-links {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .main-footer {
    padding: 3rem 0 0;
    margin-top: 4rem;

    .footer-links {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;

      .bottom-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
}
</style>
