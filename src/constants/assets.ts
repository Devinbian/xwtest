// 基础资源
const BASE = {
  LOGO: {
    DEFAULT: new URL('../assets/images/logo/logo.svg', import.meta.url).href,
    DARK: new URL('../assets/images/logo/logo-dark.svg', import.meta.url).href,
    FAVICON: new URL('../assets/images/logo/favicon.svg', import.meta.url).href
  },
  ICONS: {
    MENU: {
      OSCILLOSCOPE: new URL('../assets/icons/menu/oscilloscope.svg', import.meta.url).href,
      POWER_SUPPLY: new URL('../assets/icons/menu/power-supply.svg', import.meta.url).href,
      MULTIMETER: new URL('../assets/icons/menu/multimeter.svg', import.meta.url).href
    },
    SOCIAL: {
      WECHAT: '/assets/icons/social/wechat.svg',
      LINKEDIN: '/assets/icons/social/linkedin.svg'
    }
  },
  BACKGROUNDS: {
    PATTERN_1: '/assets/images/backgrounds/pattern-1.svg',
    PATTERN_2: '/assets/images/backgrounds/pattern-2.svg',
    TECH: '/assets/images/backgrounds/tech-bg.svg'
  }
}

// 首页资源
const HOME = {
  HERO: new URL('../assets/images/hero/home-hero.jpg', import.meta.url).href,
  BRANDS: {
    KEYSIGHT: new URL('../assets/images/brands/keysight/logo.svg', import.meta.url).href,
    TEKTRONIX: new URL('../assets/images/brands/tektronix/logo.svg', import.meta.url).href,
    FLUKE: new URL('../assets/images/brands/fluke/logo.png', import.meta.url).href
  }
}

// 产品页资源
const PRODUCTS = {
  HERO: '/assets/images/hero/products-hero.jpg',
  ITEMS: {
    OSCILLOSCOPES: {
      MSO46: {
        IMAGE: '/assets/images/products/oscilloscopes/mso46/main.jpg',
        THUMB: '/assets/images/products/oscilloscopes/mso46/thumb.jpg',
        BRAND: 'Tektronix',
        NAME: 'MSO46 示波器',
        DESCRIPTION: '高性能混合信号示波器'
      },
      TBS2000B: {
        IMAGE: '/assets/images/products/oscilloscopes/tbs2000b/main.jpg',
        THUMB: '/assets/images/products/oscilloscopes/tbs2000b/thumb.jpg',
        BRAND: 'Tektronix',
        NAME: 'TBS2000B 示波器',
        DESCRIPTION: '数字存储示波器'
      }
    },
    POWER_SUPPLIES: {
      E36312A: {
        IMAGE: '/assets/images/products/power-supplies/e36312a/main.jpg',
        THUMB: '/assets/images/products/power-supplies/e36312a/thumb.jpg',
        BRAND: 'Keysight',
        NAME: 'E36312A 电源',
        DESCRIPTION: '可编程直流电源'
      }
    },
    MULTIMETERS: {
      FLUKE_87V: {
        IMAGE: '/assets/images/brands/fluke/products/87v.png',
        BRAND: 'Fluke',
        NAME: 'Fluke 87V',
        DESCRIPTION: '工业用万用表'
      }
    }
  }
}

// 品牌页资源
const BRANDS = {
  HERO: '/assets/images/hero/brands-hero.jpg',
  KEYSIGHT: {
    LOGO: '/assets/images/brands/keysight/logo.svg',
    BANNER: '/assets/images/brands/keysight/products/banner.jpg'
  },
  TEKTRONIX: {
    LOGO: '/assets/images/brands/tektronix/logo.svg'
  },
  FLUKE: {
    LOGO: '/assets/images/brands/fluke/logo.png'
  }
}

// 关于页资源
const ABOUT = {
  HERO: '/assets/images/hero/about-hero.jpg',
  VIDEO: {
    URL: '/assets/videos/company-intro.mp4',
    POSTER: '/assets/videos/company-intro-poster.svg'
  }
}

export const ASSETS = {
  BASE,
  HOME,
  PRODUCTS,
  BRANDS,
  ABOUT
} 