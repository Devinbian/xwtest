import { getAssetUrl } from '@/utils/assets';
export const services = [
    {
      id: 1,
      title: '技术商谈',
      icon: getAssetUrl('/images/icons/consult.svg'),
      description: '专业的技术团队为您提供全方位的解决方案咨询',
      features: [
        '需求分析',
        '方案设计',
        '技术支持',
        '成本优化'
      ]
    },
    {
      id: 2,
      title: '交货安装调试',
      icon: getAssetUrl('/images/icons/install.svg'),
      description: '专业的安装团队确保设备完美运行',
      features: [
        '现场勘察',
        '专业安装',
        '系统调试',
        '性能验证'
      ]
    },
    {
      id: 3,
      title: '使用培训',
      icon: getAssetUrl('/images/icons/training.svg'),
      description: '全面的培训确保您能充分利用设备功能',
      features: [
        '操作培训',
        '维护培训',
        '应用指导',
        '技术文档'
      ]
    },
    {
      id: 4,
      title: '定期维保',
      icon: getAssetUrl('/images/icons/maintenance.svg'),
      description: '定期维护保养，确保设备持续稳定运行',
      features: [
        '定期检查',
        '预防性维护',
        '性能优化',
        '故障预警'
      ]
    },
    {
      id: 5,
      title: '修理校正',
      icon: getAssetUrl('/images/icons/repair.svg'),
      description: '快速响应的维修服务和精准的校准服务',
      features: [
        '故障诊断',
        '维修服务',
        '校准服务',
        '性能认证'
      ]
    }
  ];