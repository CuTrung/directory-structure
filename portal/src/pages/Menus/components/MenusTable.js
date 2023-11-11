import { showConfirmModal } from 'redux/actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteListMenu, deleteMenu } from 'pages/Menus/menus.service';

const MenusTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Icon',
        accessor: 'icon_path',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <i className={p?.icon_path}></i>,
      },
      {
        header: 'Tên menu',
        accessor: 'menu_name',
      },
      {
        header: 'Quyền',
        accessor: 'function_name',
      },
      {
        header: 'Link',
        accessor: 'link_menu',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
      },
      {
        header: 'Thứ tự',
        accessor: 'order_index',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SYS_MENU_ADD',
        onClick: () => window._$g.rdr(`/menus/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_MENU_EDIT',
        onClick: (p) => window._$g.rdr(`/menus/edit/${p?.menu_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_MENU_VIEW',
        onClick: (p) => window._$g.rdr(`/menus/detail/${p?.menu_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_MENU_EDIT',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                deleteListMenu([_?.menu_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteListMenu(e.map((o) => o.menu_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default MenusTable;
