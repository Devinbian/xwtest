import { getAssetUrl } from "@/utils/assets";
export const industries = [
  {
    id: 1,
    name: "传统汽车",
    image: getAssetUrl("/images/industries/auto.jpg"),
    description: "提供完整的汽车电子测试解决方案",
    features: [
      "发动机性能测试",
      "车载网络分析",
      "电子控制单元测试",
      "整车电气性能验证",
    ],
  },
  {
    id: 2,
    name: "新能源汽车",
    image: getAssetUrl("/images/industries/material.jpg"),
    description: "电池、电机、电控等全方位测试方案",
    features: [
      "电池包性能测试",
      "电机控制器测试",
      "充电系统验证",
      "BMS功能测试",
    ],
  },
  {
    id: 3,
    name: "液晶显示",
    image: getAssetUrl("/images/industries/lcd.jpg"),
    description: "液晶面板测试及自动化解决方案",
  },
  {
    id: 4,
    name: "半导体",
    image: getAssetUrl("/images/industries/semiconductor.jpg"),
    description: "半导体器件测试与可靠性验证",
  },
  {
    id: 5,
    name: "化学工业",
    image: getAssetUrl("/images/industries/chemical.jpg"),
    description: "化工过程控制与安全监测方案",
  },
  {
    id: 6,
    name: "PCB",
    image: getAssetUrl("/images/industries/pcb.jpg"),
    description: "印制电路板测试与品质管控方案",
  },
  {
    id: 7,
    name: "医药",
    image: getAssetUrl("/images/industries/medical.jpg"),
    description: "医药研发与生产质量控制方案",
  },
  {
    id: 8,
    name: "环境",
    image: getAssetUrl("/images/industries/environment.jpg"),
    description: "环境监测与污染防治解决方案",
  },
];
