import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNavigation } from 'services/auth.service';
import { triggerSidebar } from 'reduxApp/actions/global';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MenuRecursive from 'layouts/sidebar/MenuRecursive';
import _ from 'lodash';
import ChangePassword from 'layouts/sidebar/ChangePassword';
import { UserSection } from './UserSection';

/**
 * Convert Menu
 * @returns
 */
const getNavMenuItems = (items = []) => {
  const itemsMap = {};
  const ret = items.map((item) => {
    const opts = item._ ?? {};
    delete item._;
    const parentItem = itemsMap[item.parent_id];
    const navItem = {
      key: item.menu_id,
      path: item.link_menu,
      icon: item.icon_path,
      label: item.menu_name,
      name: item.menu_name,
    };
    itemsMap[item.menu_id] = navItem;
    if (parentItem && opts.level > 1) {
      parentItem.children = parentItem.children ?? [];
      parentItem.children.push(navItem);
      return null;
    }
    return navItem;
  });

  const menuResult = ret.filter((item) => !!item);
  expandPath(menuResult);
  return menuResult;
};

/**
 * Update Menu Parent Not Link
 * @param {*} nodes
 */
const expandPath = (nodes) => {
  for (const node of nodes || []) {
    if (node.children && node.children.length > 0) {
      node.label = node.name;
    }
    expandPath(node.children);
  }
};

const SideBar = () => {
  const { pathname } = useLocation();
  const [loadFirst, setLoadFirst] = useState(true);
  const [openKey, setOpenKey] = useState({});
  const [isChangePassword, setIsChangePassword] = useState(false);

  const dispatch = useDispatch();

  const [menus, setMenus] = useState([]);
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    const getMenus = async () => {
      try {
        const menus = await getNavigation();
        setMenus(menus);
        const navigation = getNavMenuItems(JSON.parse(JSON.stringify(menus ?? [])));
        setNavigation(navigation);
      } catch (error) {}
    };
    getMenus();
  }, []);

  const handleCollapse = () => {
    dispatch(triggerSidebar());
  };

  const handleSetOpen = (key) => {
    const menu = menus.find((o) => o[key ? 'menu_id' : 'link_menu'] === (key ?? pathname));
    setOpenKey((state) => ({
      ...state,
      [menu?.menu_id]: true,
    }));
    if (menu?.parent_id === '0') return;
    handleSetOpen(menu.parent_id);
  };

  useEffect(() => {
    if (Array.isArray(menus) && menus.length > 0 && pathname && _.isEmpty(openKey) && loadFirst) {
      setLoadFirst(false);
      handleSetOpen();
    }
  }, [pathname, menus]);

  useEffect(() => {
    /**
     * pathname change openKey[menu_id] not true -> set true
     * _path: /stocks-in-request/add?param1=10000 => /stocks-in-request
     */
    const _path = pathname.replace(/(\/add(.+)?|\/edit(.+)?|\/view(.+)?|\/detail(.+)?)$/, '');
    const findMenu = menus?.find((x) => x.link_menu === _path);
    if (findMenu?.menu_id && !openKey[findMenu?.menu_id]) {
      setOpenKey({});
      handleSetOpen(findMenu.menu_id);
    }
  }, [pathname, menus, openKey]);

  return (
    <div id='sidebar__left' className='bw_sidebar'>
      <div className='bw_logo'>
        <Link className='bw_main_logo' to='/'></Link>
        <Link className='bw_footer_logo' to='/'></Link>
        <span onClick={handleCollapse} id='bw_close_nav' className='fi fi-rr-angle-small-left'></span>
      </div>
      <UserSection setIsChangePassword={setIsChangePassword} />
      <ul id='menu__list' className='bw_main_menu'>
        <MenuRecursive
          items={navigation}
          openKey={openKey}
          recursiveOpenKey={(value) => {
            setOpenKey({});
            handleSetOpen(value);
          }}
          setOpenKey={setOpenKey}
        />
      </ul>
      {isChangePassword && <ChangePassword onClose={() => setIsChangePassword(false)} />}
    </div>
  );
};

export default SideBar;
