module.exports = {
    formatDate: (date) => new Intl.DateTimeFormat(['ban', 'id'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(date).replaceAll(".", ":").replace(" ", ", "),
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return that.formatDate(result).split(",")[0];
    }
}