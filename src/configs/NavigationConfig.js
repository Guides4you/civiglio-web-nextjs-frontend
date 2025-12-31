import {
  DashboardOutlined,
  GlobalOutlined, EditOutlined, UserOutlined
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

const profileNavTree = [
  {
    key: 'profile-default',
    path: `${APP_PREFIX_PATH}/profile`,
    title: 'sidenav.profile',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'profile-edit',
        path: `${APP_PREFIX_PATH}/profile/edit`,
        title: 'sidenav.profile.edit',
        icon: EditOutlined,
        breadcrumb: false,
        submenu: []
      }
    ]
  }
]


const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/dashboards`,
  title: 'sidenav.dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [

    {
      key: 'dashboards-default',
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      title: 'sidenav.dashboard.default',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'grafql',
      path: `${APP_PREFIX_PATH}/gql/graphqltest`,
      title: 'sidenav.gestionecontenuti.gql',
      icon: EditOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'maptest',
      path: `${APP_PREFIX_PATH}/gql/maptest`,
      title: 'sidenav.gestionecontenuti.map',
      icon: EditOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
}];

const poiNavTree = [
  {
    key: 'poi',
    path: `${APP_PREFIX_PATH}/poi`,
    title: 'sidenav.gestionecontenuti',
    icon: GlobalOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'addedit',
        path: `${APP_PREFIX_PATH}/poi/addeditpoi`,
        title: 'sidenav.gestionecontenuti.addedit',
        icon: EditOutlined,
        breadcrumb: false,
        submenu: []
      }
    ]
  }
]



const navigationConfig = [
  ...profileNavTree
  ,  ...poiNavTree]

export default navigationConfig;
