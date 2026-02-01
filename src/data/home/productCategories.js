import { getAssetUrl } from '@/utils/assets';

export const productCategories = [
    {
      id: 1,
      name: '汽车关联',
      icon: getAssetUrl('/images/icons/auto.svg'),
      image: getAssetUrl('/images/products/auto-related.jpg'),
      items: [
        '排气分析系统',
        'VOC检测系统',
        '氙灯试验设备',
        '各种腐蚀气体试验系统',
        '光泽计・透光计',
        '应力片・应力计',
        '振動・噪音检测系统',
        '旋转速度、加速度計',
        '多通道记录设备',
        '照度计・色彩色差仪'
      ]
    },
    {
      id: 2,
      name: '液晶关联',
      image: getAssetUrl('/images/products/lcd-related.jpg'),
      items: [
        '老化・耐久试验设备',
        '信号发生器',
        '电子显微镜',
        '屏幕颜色评价系统',
        '薄膜表面检查装置',
        '膜厚仪',
        'AC/DC电源・电子负载',
        '温湿度试验设备',
        '闪烁检查设备',
        '亮度・色彩・色差'
      ]
    },
    {
      id: 3,
      name: 'PCB关联',
      image: getAssetUrl('/images/products/pcb-related.jpg'),
      items: [
        '离子迁移系统',
        '接触角仪',
        '电子显微镜',
        '离子研磨机',
        '金相显微镜',
        'FTIR红外显微镜',
        '铜厚・镀层测量仪',
        'ICP离子光谱发生仪',
        'XRAY荧光分析仪',
        '拉伸试验机'
      ]
    },
    {
      id: 4,
      name: '新能源关联',
      image: getAssetUrl('/images/products/new-energy-related.jpg'),
      items: [
        '电子显微镜',
        '轮廓仪・画像测定仪',
        '内阻测试仪',
        '电池充放电系统',
        '冲击试验机',
        '热分析装置',
        '搅拌机・振动计',
        '膜厚仪・裁切机',
        '电源・电子负载',
        '恒温恒湿箱'
      ]
    },
    {
      id: 5,
      name: '半导体关联',
      image: getAssetUrl('/images/products/semiconductor-related.jpg'),
      items: [
        '高精度万用表',
        '高精度电流发生器',
        'LCR表',
        'FTIR分析装置',
        '频率仪',
        '高速半導体元器件测量仪',
        '磁场（力）測定器',
        '微小电流计',
        'ICT检测设备',
        'X射线透视检查装置'
      ]
    }
  ];