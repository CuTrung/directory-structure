import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { statusTypesOption } from 'utils/helpers';
import { getListFunction } from 'pages/Menus/menus.service';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

const MenusFilter = ({ onChange, onClear }) => {
  const [dataListFunction, setDataListFunction] = useState([]);
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  const loadFunction = useCallback(() => {
    getListFunction().then(setDataListFunction);
  }, []);
  useEffect(loadFunction, [loadFunction]);
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Tên menu, tên quyền' />,
          },
          {
            title: 'Quyền',
            component: (
              <FormSelect
                showSearch
                type='text'
                field='function_id'
                placeholder='Chọn quyền'
                list={(dataListFunction ?? []).map((_) => {
                  return {
                    label: _.name,
                    value: _.id,
                  };
                })}
              />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                allowClear={true}
                fieldStart='from_date'
                fieldEnd='to_date'
                placeholder={['Từ ngày', 'Đến ngày']}
                format='DD/MM/YYYY'
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default MenusFilter;
