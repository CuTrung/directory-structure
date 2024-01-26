const SingleResponse = require("./single.response");

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
    this.items = items;
    this.totalItems = totalItems;
    this.page = page;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
    this.itemsPerPage = itemsPerPage;
  }
}

module.exports = ListResponse;
