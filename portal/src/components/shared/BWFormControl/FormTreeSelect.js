import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import { TreeSelect } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useFormContext } from 'react-hook-form';

const TreeSelectStyle = styled(TreeSelect)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
    margin: 1.8px 0;
    border: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;

const FormTreeSelect = ({
  field,
  validation,
  bordered,
  fetchOptions,
  debounceTimeout,
  placeholder,
  dropdownStyle,
  ...props
}) => {
  const methods = useFormContext();
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    methods?.register(field, validation);
  }, [methods, field, validation]);

  useEffect(() => {
    fetchOptions({ parent_id: 0 }).then((res) => setTreeData(res));
  }, []);

  const loadData = ({ id: parent_id }) =>
    fetchOptions({ parent_id }).then((options) => {
      setTreeData(treeData.concat(options));
    });

  return (
    <React.Fragment>
      <TreeSelectStyle
        value={methods.watch(field)}
        suffixIcon={<CaretDownOutlined />}
        dropdownStyle={dropdownStyle}
        placeholder={placeholder}
        onChange={(e) => {
          methods.clearErrors(field);
          methods.setValue(field, e);
        }}
        loadData={loadData}
        treeData={treeData}
        {...props}
      />
      {methods.formState.errors[field] && <ErrorMessage message={methods.formState.errors[field]?.message} />}
    </React.Fragment>
  );
};

FormTreeSelect.propTypes = {
  field: PropTypes.string.isRequired,
  validation: PropTypes.object,
  bordered: PropTypes.bool,
  fetchOptions: PropTypes.func,
  debounceTimeout: PropTypes.number,
};

FormTreeSelect.defaultProps = {
  field: '',
  bordered: false,
  fetchOptions: () => {},
  debounceTimeout: 500,
  dropdownStyle: {
    maxHeight: 400,
    overflow: 'auto',
  },
  placeholder: '--Chọn--',
};

export default FormTreeSelect;
