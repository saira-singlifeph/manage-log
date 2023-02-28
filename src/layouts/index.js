import React, { useState } from 'react';
import { 
  Route, 
  Routes, 
  Navigate, 
  useNavigate 
} from 'react-router-dom';
// AntD
import { DatabaseFilled } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
// Components
import Logs from '../components/Logs'
import Analytics from '../components/Analytics';
// CSS
import './style.css';

const { Header, Content, Footer, Sider } = Layout;


const items2 = [
  {
    icon: DatabaseFilled,
    subs: ['Logs', 'Analytics']
  },
].map(({ icon, subs }) => {
  return {
    key: 1,
    icon: React.createElement(icon),
    label: `Manage Logs`,
    children: subs.map((sub) => {
      return {
        key: sub,
        label: sub,
      };
    })
  };
});

const navigations = [
  {
    label: 'Logs', 
    path: '/logs',
  },
  {
    label: 'Analytics', 
    path: '/analytics',
  }
];



const Dashboard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate(); 

  const [ currentPath, setCurrentPath ] = useState('Logs');

  const HandleMenuClick = ({ key }) => {
    const { path, label } = navigations.find(item => item.label === key) || {};
    if (path) {
      setCurrentPath(label);
      navigate(path);
    }
  };
  
  return (
    <Layout>
      <Header className='header'>
        <div className='logo' />
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['Logs']} items={[{ key: 1, label: 'Logs' }]} />
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>{currentPath}</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode='inline'
              defaultSelectedKeys={['Logs']}
              defaultOpenKeys={['Logs']}
              style={{
                height: '100%',
              }}
              items={items2}

              onClick={HandleMenuClick}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
                <Routes>
                  <Route path='/logs' element={<Logs />} />
                  <Route path='/analytics' element={<Analytics />} />
                  <Route path='*' element={<Navigate to='/logs' replace />}/>
                </Routes>
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
          Manage App - SCE
      </Footer>
    </Layout>
  );
};
export default Dashboard;