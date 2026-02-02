<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="quote-dialog-overlay" @click="handleOverlayClick">
        <div
          ref="dialogEl"
          class="quote-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          @click.stop
        >
          <div class="drag-handle" aria-hidden="true"></div>
          <div class="dialog-header">
            <h3 :id="titleId">立即咨询</h3>
            <button class="close-btn" type="button" @click="close" aria-label="关闭弹窗">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="dialog-content">
            <div class="product-info" v-if="product">
              <h4>{{ product.name }}</h4>
              <p>{{ product.description }}</p>
            </div>

            <div class="consult-scope" aria-label="咨询可获取的信息">
              <div class="scope-title">咨询可获取：</div>
              <div class="scope-items">
                <span class="scope-item">价格</span>
                <span class="scope-item">交期</span>
                <span class="scope-item">质保</span>
                <span class="scope-item">是否现货</span>
                <span class="scope-item">服务承诺</span>
              </div>
            </div>

            <div v-if="contextText" class="consult-context" aria-label="咨询上下文">
              <div class="context-header">
                <div class="context-title">咨询上下文（可复制给销售）</div>
                <button
                  type="button"
                  class="copy-btn"
                  @click="copyContext"
                  :class="{ copied }"
                  :aria-label="copied ? '已复制' : '复制上下文'"
                >
                  <i class="fas" :class="copied ? 'fa-check' : 'fa-copy'" aria-hidden="true"></i>
                  <span>{{ copied ? '已复制' : '复制' }}</span>
                </button>
              </div>
              <span class="sr-only" role="status" aria-live="polite">{{ copied ? '已复制到剪贴板' : '' }}</span>
              <textarea class="context-box" readonly :value="contextText" aria-label="咨询上下文内容"></textarea>
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

                <div class="contact-actions" aria-label="快捷操作">
                  <a class="action-btn primary" href="tel:186-6258-5852">
                    <i class="fas fa-phone-alt" aria-hidden="true"></i>
                    <span>一键拨号</span>
                  </a>
                  <a class="action-btn" href="mailto:sales@xwtest.com.cn">
                    <i class="fas fa-envelope" aria-hidden="true"></i>
                    <span>发送邮件</span>
                  </a>
                </div>
              </div>

              <!-- 右侧二维码 -->
              <div class="qr-code-container">
                <div class="qr-code">
                  <img :src="getAssetUrl('/images/qrcode.png')" alt="微信二维码" loading="lazy" decoding="async">
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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  show: boolean;
  product?: {
    name: string;
    description: string;
  };
  contextText?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const copied = ref(false);
let copiedTimer: number | null = null;
const dialogEl = ref<HTMLElement | null>(null);
const titleId = `quote-dialog-title-${Math.random().toString(16).slice(2)}`;

let prevBodyOverflow: string | null = null;

const syncBodyScrollLock = (open: boolean) => {
  if (typeof document === 'undefined') return;

  if (open) {
    if (prevBodyOverflow === null) prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else {
    if (prevBodyOverflow !== null) document.body.style.overflow = prevBodyOverflow;
    prevBodyOverflow = null;
  }
};

const copyTextFallback = (text: string): boolean => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

const copyContext = async () => {
  if (!props.contextText) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.contextText);
    } else {
      const ok = copyTextFallback(props.contextText);
      if (!ok) return;
    }

    copied.value = true;
    if (copiedTimer) window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => {
      copied.value = false;
      copiedTimer = null;
    }, 1600);
  } catch {
    // no-op: keep silent to avoid UX noise in a non-form dialog
  }
};

onUnmounted(() => {
  if (copiedTimer) window.clearTimeout(copiedTimer);
  copiedTimer = null;
  syncBodyScrollLock(false);
  document.removeEventListener('keydown', handleKeydown);
});

const close = () => {
  emit('close');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.show) return;
  if (e.key === 'Escape') close();
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

watch(
  () => props.show,
  (open) => {
    syncBodyScrollLock(open);
    if (!open) return;
    void nextTick(() => {
      dialogEl.value?.focus();
    });
  },
  { immediate: true },
);

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
  height: 100dvh;
  height: 100vh;
  background: radial-gradient(circle at 20% 10%, rgba(131, 183, 53, 0.20) 0%, rgba(0, 0, 0, 0) 42%),
    radial-gradient(circle at 80% 60%, rgba(131, 183, 53, 0.10) 0%, rgba(0, 0, 0, 0) 55%),
    rgba(0, 0, 0, 0.66);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
}

.quote-dialog {
  --dialog-bg: rgba(255, 255, 255, 0.98);
  --dialog-border: rgba(0, 0, 0, 0.08);
  --muted: rgba(0, 0, 0, 0.58);
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.40);
  background: var(--dialog-bg);
  border: 1px solid var(--dialog-border);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: calc(100dvh - 40px);
  max-height: calc(100vh - 40px);
  margin: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow);
  position: relative;
  z-index: 100000;
  transform-origin: center center;
  outline: none;
  overscroll-behavior: contain;
  
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

  .drag-handle {
    display: none;
    width: 42px;
    height: 5px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.18);
    margin: 10px auto 0;
  }

  .dialog-header {
    flex: 0 0 auto;
    z-index: 2;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.94) 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    h3 {
      font-size: 1.2rem;
      color: vars.$primary-black;
      margin: 0;
      letter-spacing: 0.2px;
    }

    .close-btn {
      background: rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.08);
      font-size: 1.2rem;
      color: #666;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      transition: transform 0.2s ease, opacity 0.2s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.06);
        color: #333;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .dialog-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1.1rem 1.25rem 1.25rem;

    .product-info {
      margin-bottom: 1.25rem;
      padding: 0.95rem 0.95rem 0.9rem;
      border: 1px solid rgba(vars.$primary-green, 0.12);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(vars.$primary-green, 0.08) 0%, rgba(0, 0, 0, 0.02) 55%, rgba(255, 255, 255, 0.0) 100%);

      h4 {
        font-size: 1.05rem;
        color: vars.$primary-black;
        margin-bottom: 0.5rem;
        line-height: 1.25;
      }

      p {
        color: var(--muted);
        font-size: 0.92rem;
        line-height: 1.55;
        margin: 0;
      }
    }

    .consult-scope {
      margin-bottom: 1rem;
      padding: 0.75rem 0.9rem;
      border-radius: 14px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      background: rgba(255, 255, 255, 0.65);

      .scope-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: vars.$primary-black;
        margin-bottom: 0.55rem;
      }

      .scope-items {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .scope-item {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(vars.$primary-green, 0.08);
        border: 1px solid rgba(vars.$primary-green, 0.14);
        color: color-mix(in srgb, #{vars.$primary-green} 92%, #000 8%);
        font-size: var(--text-xs);
        line-height: 1.35;
      }
    }

    .consult-context {
      margin-bottom: 1.1rem;
      padding: 0.9rem;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(250, 250, 250, 0.95) 100%);

      .context-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .context-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: vars.$primary-black;
      }

      .copy-btn {
        height: 38px;
        padding: 0 12px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.9);
        color: vars.$primary-black;
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;

        &:hover {
          background: rgba(vars.$primary-green, 0.08);
          border-color: rgba(vars.$primary-green, 0.20);
        }

        &:active {
          transform: scale(0.98);
        }

        &.copied {
          background: rgba(vars.$primary-green, 0.12);
          border-color: rgba(vars.$primary-green, 0.22);
        }
      }

      .context-box {
        width: 100%;
        min-height: 120px;
        resize: vertical;
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        padding: 10px 12px;
        font-size: var(--text-sm);
        line-height: 1.5;
        color: #333;
        background: rgba(255, 255, 255, 0.9);
      }
    }

    .contact-container {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 180px;
      column-gap: 1.25rem;
      row-gap: 0.9rem;
      align-items: stretch;

      .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        min-height: 100%;
        align-self: stretch;

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.9rem 0.95rem;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.65);

          i {
            font-size: 1.15rem;
            color: vars.$primary-green;
            width: 28px;
            text-align: center;
          }

          .contact-details {
            h5 {
              font-size: 0.95rem;
              color: vars.$primary-black;
              margin: 0 0 0.25rem;
            }

            a {
              color: vars.$primary-black;
              text-decoration: none;
              font-size: 1.02rem;
              font-weight: 600;
              letter-spacing: 0.2px;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }

        .contact-actions {
          display: none;
        }

        .action-btn {
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.10);
          background: rgba(255, 255, 255, 0.9);
          color: vars.$primary-black;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: transform 0.18s ease, background 0.2s ease, border-color 0.2s ease;

          i {
            color: vars.$primary-green;
          }

          &:active {
            transform: scale(0.98);
          }

          &.primary {
            background: linear-gradient(135deg, rgba(vars.$primary-green, 0.92) 0%, rgba(vars.$primary-green, 0.70) 100%);
            border-color: rgba(vars.$primary-green, 0.35);
            color: #0b1200;

            i {
              color: #0b1200;
            }
          }
        }
      }

      .qr-code-container {
        width: 180px;
        min-height: 100%;
        display: flex;
        align-self: stretch;
        height: 100%;
        grid-column: 2;
        
        .qr-code {
          flex: 1;
          width: 100%;
          height: 100%;
	          display: flex;
	          flex-direction: column;
	          justify-content: center;
          text-align: center;
          padding: 0.95rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.65);
          
          img {
            width: 140px;
            height: 140px;
            margin-bottom: 0.55rem;
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.06);
          }

          p {
            font-size: 0.9rem;
            color: var(--muted);
            margin: 0;
          }
        }
      }
    }
  }
}

@media (min-width: 641px) {
  .quote-dialog {
    .dialog-content {
      .contact-container {
        .contact-methods {
          display: contents;
        }

        .contact-item {
          grid-column: 1;
        }

        .qr-code-container {
          grid-column: 2;
          grid-row: 1 / span 2;
        }
      }
    }
  }
}

@media (pointer: coarse) {
  .quote-dialog {
    .dialog-content {
      .contact-container {
        .qr-code-container {
          grid-row: 1 / -1;
        }

        .contact-methods {
          .contact-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 0.1rem;
          }
        }
      }
    }
  }
}

@media (pointer: coarse) and (max-width: 420px) {
  .quote-dialog {
    .dialog-content {
      .contact-container {
        .contact-methods {
          .contact-actions {
            grid-template-columns: 1fr;
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;

  .quote-dialog {
    transition: transform 0.3s ease, opacity 0.3s ease;
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
  .quote-dialog-overlay {
    align-items: flex-end;
    justify-content: center;
    padding: 0;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .quote-dialog {
    width: 100%;
    max-width: none;
    max-height: min(92dvh, calc(100dvh - env(safe-area-inset-top) - 8px));
    max-height: min(92vh, calc(100vh - 8px));
    margin: 0;
    border-radius: 18px 18px 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;

    .drag-handle {
      display: block;
    }

    .dialog-header {
      padding: 0.95rem 1rem;
    }

    .dialog-content {
      padding: 1rem 1rem calc(1rem + env(safe-area-inset-bottom));
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;

    .quote-dialog {
      transform: translateY(18px);
    }
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;

    .quote-dialog {
      transform: translateY(0);
    }
  }

  // Match specificity of the desktop rules so the layout actually overrides (scoped CSS).
  .quote-dialog {
    .dialog-content {
      .contact-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .contact-methods {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;

          // Mobile: remove redundant cards; keep only the quick action buttons below.
          .contact-item {
            display: none;
          }

          // On mobile we always show the quick actions (tap-first).
          .contact-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 2px;
          }
        }

        .qr-code-container {
          width: 100%;
          margin-top: 0;
          display: block;
          align-self: stretch;

          .qr-code {
            flex: initial;
            height: auto;
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 14px 14px 16px;
            display: grid;
            justify-items: center;
            gap: 10px;

            img {
              width: min(240px, 72vw);
              height: auto;
              aspect-ratio: 1 / 1;
            }

            p {
              margin: 0;
              font-size: 0.86rem;
            }
          }
        }
      }
    }
  }
}
</style> 
