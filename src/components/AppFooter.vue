<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>联系方式</h3>
        <p>📞 400-888-8888</p>
        <p>📧 info@example.com</p>
        <p>📍 上海市浦东新区张江高科技园区</p>
      </div>
      
      <div class="footer-section">
        <h3>快速链接</h3>
        <router-link to="/products">产品中心</router-link>
        <router-link to="/brands">品牌展示</router-link>
        <router-link to="/about">关于我们</router-link>
      </div>
      
      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="qr-code">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example" alt="微信二维码">
          <p>扫码关注公众号</p>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 仪器设备专业供应商. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: #2c3e50;
  color: white;
  padding: 4rem 2rem 1rem;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;

    .footer-section {
      h3 {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -0.5rem;
          width: 50px;
          height: 2px;
          background: #3498db;
        }
      }

      p {
        margin-bottom: 0.8rem;
        opacity: 0.8;
      }

      a {
        display: block;
        color: white;
        text-decoration: none;
        margin-bottom: 0.8rem;
        opacity: 0.8;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }

      .qr-code {
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
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    text-align: center;
    
    p {
      opacity: 0.6;
      font-size: 0.9rem;
    }
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: 2rem 1rem 1rem;

    .footer-content {
      gap: 2rem;
    }
  }
}
</style> 