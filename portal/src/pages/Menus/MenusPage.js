import React, { useState, useCallback, useEffect } from 'react';
import MenusTable from './components/MenusTable';
import { getListMenus } from 'pages/Menus/menus.service';
import MenusFilter from './components/MenuFilter';

const MenusPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadMenus = useCallback(() => {
    setLoading(true);
    getListMenus(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadMenus, [loadMenus]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <MenusFilter
          onClear={() => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            });
          }}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <MenusTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadMenus}
        />
      </div>
    </React.Fragment>
  );
};

export default MenusPage;
