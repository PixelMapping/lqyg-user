// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: '首页',
              icon: 'HomeOutlined',
              path: '/home',
              component: './home',
            },
            {
              name: '商户管理',
              icon: 'ShopOutlined',
              path: '/merchant',
              component: './merchant',              
            },
            {
              path: '/merchant/add',
              name: '添加商户',
              hideInMenu: true,
              component: './merchant/add',
            },  
            {
              name: '充值管理',
              icon: 'WalletOutlined',
              path: '/recharge',
              component: './recharge',
            },      
            {
              path: '/recharge/detail',
              name: '充值详情',
              hideInMenu: true,
              component: './recharge/detail',
            },
            // {
            //   name: '资产管理',
            //   icon: 'WalletOutlined',
            //   path: '/assets',
            //   routes: [
            //     {
            //       path: '/assets/account',
            //       name: '账号管理',
            //       component: './assets',
            //     },
            //     {
            //       path: '/assets/recharge',
            //       name: '账户充值',
            //       hideInMenu: true,
            //       component: './assets/recharge',
            //     },
            //     {
            //       path: '/assets/record',
            //       name: '充值记录',
            //       hideInMenu: true,
            //       component: './assets/record',
            //     },
            //     {
            //       path: '/assets/detail',
            //       name: '充值记录详情',
            //       hideInMenu: true,
            //       component: './assets/detail',
            //     },
            //     {
            //       path: '/assets/card',
            //       name: '银行卡号',
            //       component: './assets/card',
            //     },
            //   ],
            // },
            {
              name: '发票管理',
              icon: 'FileTextOutlined',
              path: '/invoice',
              routes: [
                {
                  path: '/invoice/apply',
                  name: '发票申请记录',
                  component: './invoice/apply',
                },                
                {
                  path: '/invoice/detail',
                  name: '发票记录详情',
                  hideInMenu: true,
                  component: './invoice/detail',
                }     
              ],
            },
            {
              name: '通道管理',
              icon: 'FileTextOutlined',
              path: '/channel',
              routes: [
                 {
                  path: '/channel/record',
                  name: '余额查询',
                  component: './channel/record',
                },   
                {
                  path: '/channel/index',
                  name: '充值记录',
                  component: './channel/index',
                },                
                 
              ],
            },
            {
              name: '结算管理',
              icon: 'PropertySafetyOutlined',
              path: '/settlement',
              routes: [           
                {
                  path: '/settlement/batch',
                  name: '打款批次',
                  component: './settlement/batch',
                },
                {
                  path: '/settlement/detail',
                  name: '打款详情',
                  hideInMenu: true,
                  component: './settlement/detail',
                },{
                  path: '/settlement/detailInfo',
                  name: '打款明细',
                  component: './settlement/detailTable',
                }
                
              ],
            },
            // {
            //   name: '签约管理',
            //   icon: 'AuditOutlined',
            //   path: '/signing',
            //   routes: [
            //     {
            //       path: '/signing/info',
            //       name: '个人信息',
            //       component: './signing/info',
            //     },
            //     {
            //       path: '/signing/detail',
            //       name: '个人详情',
            //       hideInMenu: true,
            //       component: './signing/detail',
            //     },
            //     {
            //       path: '/signing/batch',
            //       name: '签约批次',
            //       component: './signing/batch',
            //     },
            //     {
            //       path: '/signing/import',
            //       name: '导入批量签约',
            //       component: './signing/import',
            //     },
            //     {
            //       path: '/signing/detailInfo',
            //       name: '签约明细',
            //       component: './signing/detailInfo',
            //     },
            //   ],
            // },
            {
              name: '任务大厅',
              icon: 'CarryOutOutlined',
              path: '/task',
              component: './task',
            },
            // {
            //   path: '/task/addTask',
            //   name: '发布任务',
            //   hideInMenu: true,
            //   component: './task/addTask',
            // },
            {
              path: '/task/detail',
              name: '任务详情',
              hideInMenu: true,
              component: './task/detail',
            },
            // {
            //   path: '/',
            //   redirect: '/home',
            // },
            // {
            //   path: '/admin',
            //   name: '权限',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            //   routes: [
            //     {
            //       path: '/admin/sub-page',
            //       name: 'sub-page',
            //       icon: 'smile',
            //       component: './Welcome',
            //       authority: ['admin'],
            //     },
            //   ],
            // }, // {
            //   name: '权限管理',
            //   icon: 'LockOutlined',
            //   path: '/authority',
            //   routes: [
            //     {
            //       path: '/authority/user',
            //       name: '用户管理',
            //       component: './authority/user',
            //     },
            //     {
            //       path: '/authority/role',
            //       name: '角色管理',
            //       component: './authority/role',
            //     },
            //   ],
            // },
            // {
            //   name: '上传组件',
            //   icon: 'FileTextOutlined',
            //   path: 'ImgUpload',
            //   component: '../components/ImgUpload',
            // },
            // {
            //   name: '空白页面',
            //   icon: 'smile',
            //   path: '/ssss',
            //   component: './ssss',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
