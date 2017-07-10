module.exports = (date1, date2, type) => {
  let diff = Math.abs(date1.getTime() - date2.getTime());
  switch(type) {
    case 'days':
      return diff / 86400000; // days
    case 'hours':
       return diff/ 3600000; // hours
      break;
    default:
      return diff / 60000; // minutes
      break;
  }
};