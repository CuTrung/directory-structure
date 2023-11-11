const SingleResponse = require('./single.response');
const PagedList = require('../classes/pagedList.class');

class ListResponse extends SingleResponse {
    /**
     * Paged List.
     * @param {array} items - List of items for current page.
     * @param {number} totalItems - Total items.
     * @param {number} page - Current page.
     * @param {number} totalPages - Total pages.
     * @param {number} itemsPerPage - Items per page.
     */
    constructor(items = [], totalItems = 0, page = 1, itemsPerPage = 25) {
        const listData = new PagedList(items, totalItems, page, itemsPerPage);
        super(listData);
    }
}

module.exports = ListResponse;
