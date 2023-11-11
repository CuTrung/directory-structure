const formatCurrency = (value = 0, decimals = 2, dec_point = ',', thousands_sep = '.') => {
    let parts = Number(value).toFixed(decimals).split('.');
    parts[0] = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
};

const currencyVND = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 }).format(value);

module.exports = {
    formatCurrency,
    currencyVND,
};
