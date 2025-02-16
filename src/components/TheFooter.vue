<template>
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <!-- Logo部分 -->
                <div class="footer-section logo-section">
                    <img :src="getAssetUrl('/images/logo_bottom.svg')" alt="Logo" class="footer-logo">
                    <p class="company-desc">
                        专业的仪器设备供应商，为您提供一站式测试测量解决方案
                    </p>
                </div>

                <!-- 快速链接 -->
                <div class="footer-section">
                    <h3>快速链接</h3>
                    <ul>
                        <li><router-link to="/">首页</router-link></li>
                        <li><router-link to="/new">新品</router-link></li>
                        <li><router-link to="/used">中古品</router-link></li>
                        <li><a href="https://shop.taobao.com/xxx" target="_blank">淘宝店</a></li>
                        <li><router-link to="/about">关于我们</router-link></li>
                    </ul>
                </div>

                <!-- 产品分类 -->
                <div class="footer-section">
                    <h3>产品分类</h3>
                    <ul>
                        <li>数字万用表/源表</li>
                        <li>电压/电流源</li>
                        <li>微电流计/高阻计</li>
                        <li>示波器</li>
                        <li>电气安规试验</li>
                    </ul>
                </div>

                <!-- 联系我们 -->
                <div class="footer-section contact-section">
                    <h3>联系我们</h3>
                    <div class="contact-info">
                        <p><i class="fas fa-phone-alt"></i> 186-6258-5852</p>
                        <p><i class="fas fa-envelope"></i> sales@xwtest.com.cn</p>
                        <p><i class="fas fa-clock"></i> 周一至周五 9:00-18:00</p>
                    </div>
                </div>
            </div>

            <!-- 版权及备案信息 -->
            <div class="footer-bottom">
                <div class="copyright">
                    <p>&copy; {{ new Date().getFullYear() }} 鑫万测电子科技（苏州）有限公司 版权所有</p>
                </div>
                <div class="icp">
<<<<<<< HEAD
                    <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2022042335号-1</a>
                    <!-- <span class="divider">|</span>
                    <img src="/images/gongan.png" alt="公安备案图标">
                    <a href="http://www.beian.gov.cn/" target="_blank">苏公网安备 xxxxxxxxxx号</a> -->
=======
                    <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备xxxxxxxx号-1</a>
                    <span class="divider">|</span>
                    <img :src="getAssetUrl('/images/gongan.png')" alt="公安备案图标">
                    <a href="http://www.beian.gov.cn/" target="_blank">苏公网安备 xxxxxxxxxx号</a>
>>>>>>> 0ce98f6e1ebb2616de7cfb3569ad453638c63bd5
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import { getAssetUrl } from '@/utils/assets';
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.site-footer {
    background-color: vars.$primary-black;
    color: #fff;
    padding: 4rem 0 0;
    margin-top: 4rem;

    .footer-content {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
        gap: 3rem;
        padding-bottom: 3rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-section {
        h3 {
            color: vars.$primary-green;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            font-weight: 500;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                margin-bottom: 0.8rem;

                a {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: color 0.3s;

                    &:hover {
                        color: vars.$primary-green;
                    }
                }
            }
        }
    }

    .logo-section {
        .footer-logo {
            height: 50px;
            margin-bottom: 1.5rem;
        }

        .company-desc {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }
    }

    .contact-section {
        .contact-info {
            p {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                color: rgba(255, 255, 255, 0.8);

                i {
                    color: vars.$primary-green;
                    width: 16px;
                    text-align: center;
                }
            }
        }
    }

    .footer-bottom {
        padding: 2rem 0;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;

        .copyright {
            margin-bottom: 1rem;
        }

        .icp {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;

            a {
                color: rgba(255, 255, 255, 0.6);
                text-decoration: none;
                transition: color 0.3s;

                &:hover {
                    color: vars.$primary-green;
                }
            }

            img {
                height: 16px;
                width: auto;
            }

            .divider {
                color: rgba(255, 255, 255, 0.3);
            }
        }
    }
}

@media (max-width: 1024px) {
    .site-footer {
        .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
    }
}

@media (max-width: 768px) {
    .site-footer {
        padding: 3rem 0 0;

        .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
        }

        .logo-section {
            .footer-logo {
                margin: 0 auto 1.5rem;
            }
        }

        .contact-section {
            .contact-info p {
                justify-content: center;
            }
        }

        .footer-bottom {
            .icp {
                flex-direction: column;
                gap: 0.5rem;

                .divider {
                    display: none;
                }
            }
        }
    }
}
</style>
