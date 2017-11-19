'use strict';
// @ngInject
export function InfiniteItemsService($log) {

  return {
    getConfig(options, itemService) {
      var defaultOptions = {
        size: 10,
        loadingItemViews: 5
      };

      var itemOptions = angular.extend({}, defaultOptions, options);
      var queryParams = angular
        .extend({ size: 10 }, itemOptions.queryParams);

      if (!itemOptions.totalItems || !itemService) {
        $log.info('Missing option totalItems or itemService');
        return {};
      }

      return {
        items: [],

        getItemAtIndex(index) {

          if (this.items[index]) {
            return this.items[index];
          } else {
            this.fetchMoreItems(index);
            return null;
          }
        },

        getLength() {
          let l = this.items.length;
          return this.allItemsLoaded ? l : l + itemOptions.loadingItemViews;
        },

        fetchMoreItems(index) {
          let items = this.items;

          if (!this.loading && items.length < index && !this.allItemsLoaded) {
            this.loading = true;
            queryParams.from = index - 1;

            itemService.query(queryParams).$promise.then(items => {
              this.items = this.items.concat(items);
              this.loading = false;

              if (this.items.length === itemOptions.totalItems) {
                this.allItemsLoaded = true;
                if (this.items[itemOptions.totalItems - 1]) {
                  this.items[itemOptions.totalItems - 1].$last = true;
                }
              }
            });
          }
        }

      }
    }

  }
}
