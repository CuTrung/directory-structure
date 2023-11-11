// tỷ trọng (".")
const Proportion = (number) => {
    return number.toFixed(2);
};

// đơn giá (",", ".")
const CurrencyUnitPrice = (number) => {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " đ";
};

const barcodeCurrency = number => {
    return number.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " VNĐ";
}
// thành tiền (".", đ)
const CurrencyTotalPrice = (number) => {
    number = Number(`${number || 0}`)
        .toFixed(1)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    return number.substr(0, number.length - 2);
};

// khối lượng, số lượng (",", ".")
const NetweightAndQuantity = (number) => {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const formatCurrency = (value, decimals = 2, dec_point = ',', thousands_sep = '.') => {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = Number(`${value || 0}`).toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}

module.exports = {
    Proportion,
    CurrencyUnitPrice,
    CurrencyTotalPrice,
    NetweightAndQuantity,
    numberWithCommas,
    formatCurrency,
    barcodeCurrency
};
