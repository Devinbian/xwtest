<template>
    <footer class="site-footer">
        <div class="container">
            <div class="footer-main">
                <!-- 品牌信息 -->
                <div class="footer-col brand">
                    <img :src="getAssetUrl('/images/logo_bottom.svg')" alt="Logo" class="footer-logo" loading="lazy" decoding="async">
                    <p class="company-desc">专业的仪器设备供应商，为您提供一站式测试测量解决方案</p>
                    <div class="trust-points" aria-label="服务优势">
                        <span class="trust-item">15年经验</span>
                        <span class="dot" aria-hidden="true"></span>
                        <span class="trust-item">2000+客户</span>
                        <span class="dot" aria-hidden="true"></span>
                        <span class="trust-item">24h响应</span>
                    </div>
                </div>

                <!-- 快速链接 -->
                <nav class="footer-col links" aria-label="快速链接">
                    <h3>快速链接</h3>
                    <ul>
                        <li><router-link to="/">首页</router-link></li>
                        <li><router-link :to="{ name: 'products', query: { type: 'new' } }">产品</router-link></li>
                        <li><router-link :to="{ name: 'products', query: { type: 'used' } }">中古品</router-link></li>
                        <li><router-link to="/services">服务</router-link></li>
                        <li><router-link to="/about">关于我们</router-link></li>
                        <li><a href="https://shop198581009.taobao.com" target="_blank" rel="noopener">淘宝店</a></li>
                    </ul>
                </nav>

                <!-- 产品分类 -->
                <nav class="footer-col categories" aria-label="产品分类">
                    <h3>产品分类</h3>
                    <ul>
                        <li><router-link :to="{ path: '/products', query: { categories: '1' } }">数字万用表/源表</router-link></li>
                        <li><router-link :to="{ path: '/products', query: { categories: '2' } }">电压/电流源</router-link></li>
                        <li><router-link :to="{ path: '/products', query: { categories: '3' } }">超高电阻/微小电流计</router-link></li>
                        <li><router-link :to="{ path: '/products', query: { categories: '4' } }">数字示波器</router-link></li>
                        <li><router-link :to="{ path: '/products', query: { categories: '5' } }">电气安规测试</router-link></li>
                        <li class="more">
                            <router-link to="/products">查看全部产品 <i class="fas fa-arrow-right" aria-hidden="true"></i></router-link>
                        </li>
                    </ul>
                </nav>

                <!-- 联系我们 + 二维码 -->
                <div class="footer-col contact">
                    <h3>联系我们</h3>
                    <div class="contact-grid">
                        <div class="contact-items">
                            <a class="contact-pill" href="tel:186-6258-5852">
                                <i class="fas fa-phone-alt" aria-hidden="true"></i>
                                <span>186-6258-5852</span>
                            </a>
                            <a class="contact-pill" href="mailto:sales@xwtest.com.cn">
                                <i class="fas fa-envelope" aria-hidden="true"></i>
                                <span>sales@xwtest.com.cn</span>
                            </a>
                            <div class="contact-pill muted" aria-label="工作时间">
                                <i class="fas fa-clock" aria-hidden="true"></i>
                                <span>周一至周五 9:00-18:00</span>
                            </div>
                        </div>

                        <div class="qr-card" aria-label="微信二维码">
                            <LazyPicture
                                :src="getAssetUrl('/images/qrcode.png')"
                                :placeholder="getAssetUrl('/images/qrcode-small.jpg')"
                                alt="微信二维码"
                            />
                            <span class="qr-label">扫码添加客服</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 版权及备案信息 -->
            <div class="footer-bottom">
                <div class="copyright">&copy; {{ new Date().getFullYear() }} 鑫万测电子科技（苏州）有限公司 版权所有</div>
                <div class="icp">
                    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">苏ICP备2022042335号-1</a>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import { getAssetUrl } from '@/utils/assets';
import LazyPicture from '@/components/LazyPicture.vue';
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.site-footer {
    background-color: vars.$primary-black;
    color: #fff;
    padding: clamp(28px, 4vw, 52px) 0 0;
    margin-top: clamp(28px, 4vw, 52px);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 10% 10%, rgba(vars.$primary-green, 0.09), transparent 45%),
            radial-gradient(circle at 90% 0%, rgba(vars.$primary-green, 0.06), transparent 38%),
            linear-gradient(to top, rgba(255, 255, 255, 0.04), transparent 60%);
        pointer-events: none;
        opacity: 0.8;
    }

    .footer-main {
        position: relative;
        display: grid;
        // Balanced 4-column grid with guardrails so brand/contact never get overly squeezed/expanded.
        // (.container is max-width: 1200px in this project)
        grid-template-columns:
            minmax(300px, 1.25fr)
            minmax(170px, 0.95fr)
            minmax(220px, 1.1fr)
            minmax(340px, 1.25fr);
        gap: clamp(18px, 3vw, 32px);
        padding-bottom: clamp(18px, 3vw, 32px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-col {
        min-width: 0;

        h3 {
            color: rgba(255, 255, 255, 0.92);
            font-size: 0.95rem;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin: 0 0 14px;
            font-weight: 600;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -8px;
                width: 36px;
                height: 2px;
                background: rgba(vars.$primary-green, 0.9);
                border-radius: 2px;
            }
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            gap: 10px;

            li a {
                color: rgba(255, 255, 255, 0.78);
                text-decoration: none;
                transition: color 0.2s ease, transform 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &:hover {
                    color: vars.$primary-green;
                    transform: translateX(2px);
                }
            }

            li.more a {
                color: rgba(vars.$primary-green, 0.95);
                font-weight: 600;

                i {
                    font-size: 0.9rem;
                }
            }
        }
    }

    .footer-logo {
        height: 46px;
        margin-bottom: 12px;
    }

    .company-desc {
        color: rgba(255, 255, 255, 0.75);
        line-height: 1.7;
        margin: 0 0 14px;
        font-size: 0.95rem;
        max-width: 32ch;
    }

    .trust-points {
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.82rem;
        white-space: nowrap;

        .dot {
            width: 3px;
            height: 3px;
            border-radius: 999px;
            background: rgba(vars.$primary-green, 0.85);
        }
    }

    .contact-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 112px;
        gap: 10px;
        align-items: start;
    }

    .contact-items {
        display: grid;
        gap: 10px;
        min-width: 0;
    }

    .contact-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.82);
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        min-width: 0;

        i {
            width: 16px;
            text-align: center;
            color: rgba(vars.$primary-green, 0.95);
            flex: 0 0 auto;
        }

        span {
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
            font-size: 0.9rem;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(vars.$primary-green, 0.25);
            transform: translateY(-1px);
        }

        &.muted {
            cursor: default;

            &:hover {
                transform: none;
            }
        }
    }

    .qr-card {
        width: 112px;
        padding: 10px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: grid;
        gap: 8px;
        justify-items: center;

        :deep(.lazy-picture) {
            width: 92px;
            height: 92px;
            border-radius: 12px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.06);
        }

        .qr-label {
            font-size: 0.82rem;
            color: rgba(255, 255, 255, 0.72);
            line-height: 1.2;
            text-align: center;
        }
    }

    .footer-bottom {
        position: relative;
        padding: 16px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        color: rgba(255, 255, 255, 0.62);
        font-size: 0.88rem;

        a {
            color: rgba(255, 255, 255, 0.62);
            text-decoration: none;
            transition: color 0.2s ease;

            &:hover {
                color: rgba(vars.$primary-green, 0.95);
            }
        }
    }
}

@media (max-width: 1280px) {
    .site-footer {
        .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .contact-grid {
            grid-template-columns: 1fr;
            justify-items: start;
        }

        .qr-card {
            width: 100%;
            justify-items: start;
            grid-template-columns: auto 1fr;
            align-items: center;
            justify-content: start;

            :deep(.lazy-picture) {
                width: 92px;
                height: 92px;
            }

            .qr-label {
                text-align: left;
            }
        }
    }
}

@media (max-width: 768px) {
    .site-footer {
        padding: 28px 0 0;

        .footer-main {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }
    }
}
</style>
