import CheckAccess from 'components/shared/CheckAccess';
import React, { useCallback, useState } from 'react';
import { Empty } from 'antd';
import styled from 'styled-components';
const LabelCheckbox = styled.label``;
const ContentRender = styled.span`
  margin-left: ${(props) => props.levelRecursive};
`;

const TrTable = ({
  colSpan,
  keyRender,
  flag,
  isShowCheckbox,
  hiddenRowSelect,
  _dataSelect,
  setDataSelect,
  columns,
  valueRender,
  findIndex,
  rowAction,
  renderRowAction,
  getChildren,
  levelRecursive,
  parentField,
}) => {
  const [openExpaned, setOpenExpaned] = useState(false);
  const [dataExpaned, setDataExpaned] = useState(undefined);
  const marginRecursive = levelRecursive ? `${levelRecursive * 5 + 10}px` : '10px';

  const jsx_render = () => {
    if (openExpaned) {
      if (Array.isArray(dataExpaned) && dataExpaned.length > 0) {
        return dataExpaned.map((valueR) => {
          return (
            <TrTable
              colSpan={colSpan}
              keyRender={keyRender}
              flag={flag}
              isShowCheckbox={isShowCheckbox}
              hiddenRowSelect={hiddenRowSelect}
              _dataSelect={_dataSelect}
              setDataSelect={setDataSelect}
              columns={columns}
              valueRender={valueR}
              findIndex={findIndex}
              rowAction={rowAction}
              renderRowAction={renderRowAction}
              getChildren={getChildren}
              levelRecursive={(levelRecursive ? levelRecursive : 0) + 1}
              parentField={parentField}
            />
          );
        });
      } else {
        return (
          <tr>
            <td colSpan={colSpan}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
            </td>
          </tr>
        );
      }
    }
  };

  return (
    <>
      <tr key={keyRender} className={flag ? 'bw_checked' : ''}>
        {!isShowCheckbox && (
          <td className='bw_sticky bw_check_sticky'>
            <LabelCheckbox
              style={{
                marginRight: '2px',
                display: `${typeof hiddenRowSelect === 'function' && hiddenRowSelect(valueRender) ? 'none' : ''}`,
              }}
              className='bw_checkbox'>
              <input
                type='checkbox'
                checked={flag}
                key={keyRender}
                onChange={() => {
                  if (flag) {
                    _dataSelect.splice(findIndex, 1);
                    setDataSelect(_dataSelect);
                  } else {
                    setDataSelect([..._dataSelect, valueRender]);
                  }
                }}
              />
              <span></span>
            </LabelCheckbox>
          </td>
        )}

        {columns
          ?.filter((value) => !value.hidden)
          .map((column, key) => {
            const className = column?.classNameBody ? column?.classNameBody : '';
            if (column.formatter) {
              return (
                <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);
                        if (!dataExpaned) {
                          getChildren({
                            parent_id: valueRender[`${parentField}`],
                          }).then((data) => setDataExpaned(data?.items));
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  <span>{column?.formatter(valueRender, keyRender)}</span>
                </td>
              );
            } else if (column.accessor) {
              return (
                <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);
                        if (!dataExpaned) {
                          getChildren({
                            parent_id: valueRender[`${parentField}`],
                          }).then((data) => setDataExpaned(data?.items));
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  {valueRender[column.accessor]}
                </td>
              );
            } else {
              return (
                <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                  {column.expanded && (
                    <ContentRender
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);
                        if (!dataExpaned) {
                          getChildren({
                            parent_id: valueRender[`${parentField}`],
                          }).then((data) => setDataExpaned(data?.items));
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                </td>
              );
            }
          })}
        {Boolean(rowAction?.length) && (
          <td className='bw_sticky bw_action_table bw_text_center'>{renderRowAction(valueRender, keyRender)}</td>
        )}
      </tr>
      {jsx_render()}
    </>
  );
};

export default TrTable;
