import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import FormSection from 'components/shared/FormSection';
import MenusInformation from 'pages/Menus/components/add/MenusInformation';
import MenusStatus from 'pages/Menus/components/add/MenusStatus';

import { useLocation, useParams } from 'react-router-dom';
import { createMenus, getDetailMenu, getListFunction, getListMenus, updateMenu } from 'pages/Menus/menus.service';

const MenusAddPage = () => {
  const [dataListMenu, setDataListMenu] = useState([]);
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { menu_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (menu_id) {
        await updateMenu(menu_id, payload);
        label = 'Chỉnh sửa';
      } else {
        const value = await createMenus(payload);
        setDataListMenu((prev) => {
          return [
            {
              menu_name: payload?.menu_name,
              menu_id: value,
            },
            ...prev,
          ];
        });
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      toast.success(`${label} thành công`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const loadMenusDetail = useCallback(() => {
    if (menu_id) {
      getDetailMenu(menu_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        order_index: 0,
        is_can_open_multi_windows: 0,
        is_business: 0,
        is_system: 0,
        description: '',
      });
    }
  }, [menu_id]);

  useEffect(loadMenusDetail, [loadMenusDetail]);

  const detailForm = [
    {
      title: 'Thông tin',
      id: 'information',
      dataListMenu: dataListMenu,
      component: MenusInformation,
      fieldActive: ['menu_name'],
    },
    { id: 'status', title: 'Trạng thái', component: MenusStatus },
  ];

  const loadMenus = useCallback(() => {
    getListMenus({
      itemsPerPage: 12899812,
      is_active: 1,
    })
      .then((o) => setDataListMenu(o?.items))
      .catch((_) => {})
      .finally(() => {});
  }, []);
  useEffect(loadMenus, [loadMenus]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default MenusAddPage;
