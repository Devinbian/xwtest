<template>
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>联系我们</h3>
                    <p>电话：400-123-4567</p>
                    <p>邮箱：info@example.com</p>
                    <p>地址：上海市浦东新区xxx路xxx号</p>
                </div>

                <div class="footer-section">
                    <h3>快速链接</h3>
                    <ul>
                        <li><router-link to="/">首页</router-link></li>
                        <li><router-link to="/products">产品中心</router-link></li>
                        <li><router-link to="/shop">电商平台</router-link></li>
                        <li><router-link to="/about">关于我们</router-link></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>产品分类</h3>
                    <ul>
                        <li>数字万用表/源表</li>
                        <li>电压/电流源</li>
                        <li>微电流计/高阻计</li>
                        <li>示波器</li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>关注我们</h3>
                    <div class="qrcode">
                        <img src="/images/qrcode.png" alt="微信公众号">
                        <p>扫码关注公众号</p>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; {{ new Date().getFullYear() }} 仪器仪表公司. 保留所有权利.</p>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.site-footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 4rem 0 2rem;
    margin-top: 4rem;

    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .footer-section {
        h3 {
            color: #fff;
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                margin-bottom: 0.8rem;

                a {
                    color: #ecf0f1;
                    text-decoration: none;
                    transition: color 0.3s;

                    &:hover {
                        color: var(--primary-color);
                    }
                }
            }
        }

        .qrcode {
            text-align: center;

            img {
                width: 120px;
                height: 120px;
                margin-bottom: 0.5rem;
            }

            p {
                font-size: 0.9rem;
            }
        }
    }

    .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 2rem;
        text-align: center;
        font-size: 0.9rem;
        color: #bdc3c7;
    }
}

@media (max-width: 768px) {
    .site-footer {
        padding: 2rem 0 1rem;

        .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .footer-section {
            margin-bottom: 2rem;
        }
    }
}
</style>
