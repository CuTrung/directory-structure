const _ = require('lodash');

/**
 * return new array with mapped excel header (rows[0])
 * @param {Array} data
 * @param {Number} startIndex : skip STT column
 */
const transformArrayExcel = (rows, startIndex = 1) => {
    const result = [];
    const header = rows[0];
    for (let i = startIndex; i < rows.length; i++) {
        const rowItem = {};
        for (let j = startIndex; j < header.length; j++) {
            const keyExcel = header[j];
            const valueExcel = rows[i][j];
            rowItem[keyExcel] = valueExcel;
        }
        result.push(rowItem);
    }
    return result;
};

const mappedArrayToNewKey = (array = [], mapped = {}) => {
    return array.map((item) => {
        return _.mapKeys(item, (value, key) => mapped[key]);
    });
};

const transformValues = (array = [], booleanKeys = ['is_active']) => {
    return array.map((item) => {
        for (let key in item) {
            const value = item[key];
            if (booleanKeys.includes(key)) {
                item[key] = value.toLowerCase() === 'có' || value === '1' ? 1 : 0;
            } else {
                item[key] = (value || '').toString().trim();
            }
        }
        return item;
    });
};

const defaultHeaderType = {
    font: {
        bold: true,
        color: 'white',
    },
    alignment: {
        horizontal: 'center',
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: 'black',
        },
        right: {
            style: 'thin',
            color: 'black',
        },
        top: {
            style: 'thin',
            color: 'black',
        },
        bottom: {
            style: 'thin',
            color: 'black',
        },
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: 'black',
        fgColor: 'black',
    },
};

const defaultBodyStyle = {
    border: {
        left: {
            style: 'thin',
            color: 'black',
        },
        right: {
            style: 'thin',
            color: 'black',
        },
        top: {
            style: 'thin',
            color: 'black',
        },
        bottom: {
            style: 'thin',
            color: 'black',
        },
    },
};

function columnToLetter(column) {
    let temp,
        letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

function letterToColumn(letter) {
    var column = 0,
        length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}

const addWorksheet = (
    wb,
    title = null,
    sheetName = '',
    columns = [{ width: 0, title: '', style: null, field: '', formatter: (item, index) => {}, validate: null }],
    data = [],
    headerStyle = defaultHeaderType,
    bodyStyle = defaultBodyStyle,
    options = {},
) => {
    try {
        const ws = wb.addWorksheet(sheetName, options);

        // title
        for (let index = 0; index < columns.length; index++) {
            // set width
            ws.column(index + 1).setWidth(columns[index]?.width || 10);

            // add title
            if (title && index === 0) {
                ws.cell(1, 1, 1, columns.length, true)
                    .string(title)
                    .style({
                        font: {
                            bold: true,
                        },
                        alignment: { horizontal: 'center' },
                    });
            }

            // header
            ws.cell(title ? 2 : 1, index + 1)
                .string(columns[index]?.title || '')
                .style(_.isObject(columns[index].style) ? columns[index].style : headerStyle);

            // add validate
            if (_.isObject(columns[index].validate)) {
                let validate = columns[index].validate;

                if (!Boolean(validate.sqref)) {
                    const currColumn = columnToLetter(index + 1);
                    const startDataRow = title ? 3 : 2;
                    const endDataRow = startDataRow + (data.length || 1) - 1;

                    validate = {
                        ...validate,
                        sqref: `${currColumn}${startDataRow}:${currColumn}${endDataRow}`,
                    };
                }

                ws.addDataValidation(validate);
            }
        }

        // data
        if (data && data.length > 0) {
            let indexRow = title ? 3 : 2;
            for (let indexData = 0; indexData < data.length; indexData++) {
                let item = data[indexData];
                for (let indexCol = 1; indexCol <= columns.length; indexCol++) {
                    ws.cell(indexRow, indexCol)
                        .string(
                            _.isFunction(columns[indexCol - 1]?.formatter)
                                ? `${columns[indexCol - 1].formatter(item, indexData)}`
                                : `${item[columns[indexCol - 1]?.field] || ''}`,
                        )
                        .style(bodyStyle || {});
                }
                indexRow++;
            }
        }
        return wb;
    } catch (error) {
        console.log(error);
    }
};

const getValueExcel = (rows, type, is_title = true) => {
    let keywords = {};
    let data = [];
    let firstRow = is_title ? 1 : 0;

    for (let i = 0; i < rows.length; i++) {
        if (i === firstRow) {
            for (let j = 0; j < rows[i].length; j++) {
                keywords = {
                    ...keywords,
                    [j]: Object.keys(type).find(
                        (x, index) => index === Object.values(type).findIndex((y) => y === rows[firstRow][j]),
                    ),
                };
            }
        }

        if (i >= firstRow) {
            let item = {};

            for (let index = 0; index < rows[i].length; index++) {
                item = {
                    ...item,
                    [keywords[index]]: `${rows[i][index] || ''}`.trim(),
                };
            }
            data.push(item);
        }
    }

    return data;
};

const excelHeaderStyle = {
    font: {
        bold: true,
        color: '#FFFFFF',
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#0b2447',
    },
};

const addSheet = ({ workbook, sheetName, config, data = [], headerStyle = excelHeaderStyle, isAddNoNum = false }) => {
    const worksheet = workbook.addWorksheet(sheetName, {});
    const headerRow = {};
    let _config = { ...config };
    if (isAddNoNum) {
        _config = {
            index: { title: 'STT', width: 5 },
            ..._config,
        };
        data.forEach((item, index) => (item.index = index + 1));
    }
    Object.keys(_config).forEach((key) => (headerRow[key] = _config[key].title));
    data.unshift(headerRow);

    const fields = Object.keys(_config);
    for (let indexCol = 1; indexCol <= fields.length; indexCol++) {
        const field = fields[indexCol - 1];
        const width = _config[field].width || 20;
        worksheet.column(indexCol).setWidth(width);
        worksheet.cell(1, indexCol).style(workbook.createStyle(headerStyle));

        if (_config[field].validate) {
            const validate = _config[field].validate;

            const letterCol = columnToLetter(indexCol);
            const startRowIndex = 2;

            worksheet.addDataValidation({
                ...validate,
                sqref: `${letterCol}${startRowIndex}:${letterCol}${data.length + startRowIndex + 1}`,
            });
        }
    }

    data.forEach((item, indexRow) => {
        fields.forEach((field, indexCol) => {
            worksheet.cell(indexRow + 1, indexCol + 1).string((item[field] || '').toString());
        });
    });
};

const addOptionToData = (data = [], optionKey = 'option') => {
    return data.map((dataItem) => ({
        ...dataItem,
        [optionKey]: `${dataItem?.id || ''} - ${dataItem?.name || ''}`,
    }));
};

const createSheetPageOptions = ({ ws, title = '', data, columnsCustom = [] }) => {
    return addWorksheet(
        ws,
        `DANH SÁCH ${title.toUpperCase()}`,
        `Danh sách ${title.toLowerCase()}`,
        [
            {
                width: 10,
                title: 'Id',
                field: 'id',
            },
            {
                width: 75,
                title: `Tên ${title.toLowerCase()}`,
                field: 'name',
            },
            {
                width: 30,
                title: 'Giá trị',
                formatter: (row, index) => `${row.id}-${row.name}`,
            },
            ...columnsCustom,
        ],
        data,
    );
};

const createSelectColumn = ({
    width = 20,
    title = 'Chọn',
    field,
    lengthData,
    isRequired = false,
    isCheckbox = false,
    validate = {
        type: 'list',
        allowBlank: true,
        prompt: 'Chọn giá trị',
        error: 'Giá trị không hợp lệ',
        showDropDown: true,
        formulas: [isCheckbox ? '1-Có, 0-Không' : `='Danh sách ${title.toLowerCase()}'!$C$3:$C$${2 + lengthData}`],
    },
}) => {
    return {
        width,
        title: `${title}${isRequired ? '*' : ''}`,
        field,
        validate,
    };
};

const getValueSelect = ({ listData = [], exceptFields = [], splitWith = '-' } = {}) => {
    return listData.map((item) => {
        for (const [key, value] of Object.entries(item)) {
            if (exceptFields.includes(key)) continue;
            item = { ...item, [key]: value.trim().split(splitWith)[0] };
        }
        return item;
    });
};
module.exports = {
    addWorksheet,
    getValueExcel,
    transformArrayExcel,
    mappedArrayToNewKey,
    transformValues,
    addSheet,
    addOptionToData,
    createSheetPageOptions,
    createSelectColumn,
    getValueSelect,
};
