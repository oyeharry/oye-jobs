// @ngInject
export function UtilService() {
  return {
    /**
     * Check if month is valid
     * @param  {Number}  monthNum Month number 1 - 12
     * @param  {Number}  dayNum   Day of month
     * @return {Boolean}          
     */
    isValidMonthDay(monthNum, dayNum) {
      var m = monthNum - 1;
      var d = new Date(2017, m, dayNum);
      return d.getMonth() === m;
    },

    /**
     * Check if year is valid
     * @param  {Number} year 
     * @return {Boolean}      
     */
    isValidYear(year) {
      return year < 1870 || year > new Date().getFullYear();
    }
  };
}
