export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Exception/101',
      },
      {
        path: '/resandcal',
        name: 'resandcal',
        icon: 'dashboard',
        routes: [
          {
            path: '/resandcal/resource',
            name: 'resource',
            component: './Resandcal/ResourceList',
          },
          {
            path: '/resandcal/purchase',
            name: 'purchase',
            component: './Resandcal/PurchaseList',
          },
          {
            path: '/resandcal/equipment',
            name: 'equipment',
            component: './Resandcal/EquipmentList',
          },
          {
            path: '/resandcal/mould',
            name: 'mould',
            component: './Resandcal/MouldList',
          },
          {
            path: '/resandcal/shifts',
            name: 'shifts',
            component: './Resandcal/ShiftsList',
          },
        ],
      },
      {
        path: '/products',
        name: 'products',
        icon: 'form',
        routes: [
          {
            path: '/products/archives',
            name: 'archives',
            component: './Products/ArchivesList',
          },
          {
            path: '/products/bom',
            name: 'bom',
            component: './Products/BomList',
          },
          {
            path: '/products/process',
            name: 'process',
            component: './Products/ProcessList',
          },
          {
            path: '/products/processroute',
            name: 'processroute',
            component: './Products/ProcessRoute',
          },
        ],
      },
      {
        path: '/visualization',
        icon: 'table',
        name: 'visualization',
        routes: [
          {
            path: '/visualization/order',
            name: 'order',
            component: './Visualization/OrderList',
          },
          {
            path: '/visualization/order-chart',
            name: 'order-chart',
            component: './List/TableList',
          },
          {
            path: '/visualization/equipment',
            name: 'equipment',
            component: './Visualization/EquipmentList',
          },
          {
            path: '/visualization/mould',
            name: 'mould',
            component: './Visualization/MouldList',
          },
          {
            path: '/visualization/feeding',
            name: 'feeding',
            component: './Visualization/FeedingCharts',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
