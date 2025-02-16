// 完整的 Top3 品牌数据
import { getAssetUrl } from "@/utils/assets";
export const topBrands = [
  {
    id: 1,
    name: "KEITHLEY",
    logo: getAssetUrl("/images/brands/keithley/logo.png"),
    products: [
      {
        id: 1,
        name: "KEITHLEY 2450",
        image: getAssetUrl("/images/products/battery-tester.jpg"),
        description: "高精度数字源表",
      },
      {
        id: 2,
        name: "KEITHLEY 2460",
        image: getAssetUrl("/images/products/data-acquisition.jpg"),
        description: "高压数字源表",
      },
    ],
  },
  {
    id: 2,
    name: "TEKTRONIX",
    logo: getAssetUrl("/images/brands/tektronix/logo.png"),
    products: [
      {
        id: 3,
        name: "MSO46",
        image: getAssetUrl("/images/products/environmental-chamber.jpg"),
        description: "混合信号示波器",
      },
      {
        id: 4,
        name: "TBS1000C",
        image: getAssetUrl("/images/products/multimeter-1.jpg"),
        description: "数字示波器",
      },
    ],
  },
  {
    id: 3,
    name: "KIKUSUI",
    logo: getAssetUrl("/images/brands/kikusui/logo.svg"),
    products: [
      {
        id: 5,
        name: "PWX1500L",
        image: getAssetUrl("/images/products/oscilloscope-1.jpg"),
        description: "可编程直流电源",
      },
      {
        id: 6,
        name: "PCR-WE/WE2",
        image: getAssetUrl("/images/products/power-analyzer.jpg"),
        description: "交流电源",
      },
    ],
  },
];
