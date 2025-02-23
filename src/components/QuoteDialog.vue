<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="quote-dialog-overlay" @click="handleOverlayClick">
        <div class="quote-dialog" @click.stop>
          <div class="dialog-header">
            <h3>索要报价</h3>
            <button class="close-btn" @click="close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="dialog-content">
            <div class="product-info" v-if="product">
              <h4>{{ product.name }}</h4>
              <p>{{ product.description }}</p>
            </div>

            <div class="contact-container">
              <!-- 左侧联系方式 -->
              <div class="contact-methods">
                <div class="contact-item">
                  <i class="fas fa-phone-alt"></i>
                  <div class="contact-details">
                    <h5>电话咨询</h5>
                    <a href="tel:186-6258-5852">186-6258-5852</a>
                  </div>
                </div>

                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <div class="contact-details">
                    <h5>邮件咨询</h5>
                    <a href="mailto:sales@xwtest.com.cn">sales@xwtest.com.cn</a>
                  </div>
                </div>
              </div>

              <!-- 右侧二维码 -->
              <div class="qr-code-container">
                <div class="qr-code">
                  <img :src="getAssetUrl('/images/qrcode.png')" alt="微信二维码">
                  <p>扫码添加客服微信</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { getAssetUrl } from '@/utils/assets';

interface Props {
  show: boolean;
  product?: {
    name: string;
    description: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    close();
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.quote-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
}

.quote-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: calc(100vh - 40px);
  margin: auto;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 100000;
  transform-origin: center center;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .dialog-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.2rem;
      color: vars.$primary-black;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s;

      &:hover {
        background: #f5f5f5;
        color: #333;
      }
    }
  }

  .dialog-content {
    padding: 1.5rem;

    .product-info {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;

      h4 {
        font-size: 1.1rem;
        color: vars.$primary-black;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .contact-container {
      display: flex;
      gap: 2rem;
      align-items: flex-start;

      .contact-methods {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;

          i {
            font-size: 1.5rem;
            color: vars.$primary-green;
            width: 24px;
            text-align: center;
          }

          .contact-details {
            h5 {
              font-size: 1rem;
              color: vars.$primary-black;
              margin-bottom: 0.5rem;
            }

            a {
              color: vars.$primary-green;
              text-decoration: none;
              font-size: 1.1rem;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }

      .qr-code-container {
        width: 180px;
        flex-shrink: 0;
        
        .qr-code {
          text-align: center;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 8px;
          background: #f9f9f9;
          
          img {
            width: 140px;
            height: 140px;
            margin-bottom: 0.5rem;
          }

          p {
            font-size: 0.9rem;
            color: #666;
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;

  .quote-dialog {
    transition: all 0.3s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  .quote-dialog {
    transform: scale(0.9) translateY(20px);
  }
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;

  .quote-dialog {
    transform: scale(1) translateY(0);
  }
}

// 移动端适配
@media (max-width: 640px) {
  .contact-container {
    flex-direction: column;
    align-items: center !important;

    .contact-methods {
      width: 100%;
    }

    .qr-code-container {
      width: 100% !important;
      margin-top: 1.5rem;

      .qr-code {
        max-width: 200px;
        margin: 0 auto;
      }
    }
  }
}
</style> 