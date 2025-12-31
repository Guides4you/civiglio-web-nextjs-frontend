import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import ThemeConfigurator from './ThemeConfigurator';
import { connect } from "react-redux";
import { DIR_RTL } from '../../constants/ThemeConstant';

const NavPanel = ({ direction, locale }) => {
	const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
	};

	return (
    <>
      <Menu mode="horizontal">
        <Menu.Item onClick={showDrawer}>
          <SettingOutlined className="nav-icon mr-0" />
        </Menu.Item>
      </Menu>
      <Drawer
        title="Config"
        placement={direction === DIR_RTL ? 'left' : 'right'}
        width={350}
        onClose={onClose}
        open={visible}
      >
        <ThemeConfigurator/>
      </Drawer>
    </>
  );
}

const mapStateToProps = ({ theme }) => {
  const { locale, direction } =  theme;
  return { locale, direction }
};

export default connect(mapStateToProps)(NavPanel);
