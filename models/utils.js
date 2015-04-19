/**
 * New node file
 */

function Utils(){}
module.exports = Utils;

//Utils.dateFormatter()

Utils.dateFormatter = function(date){
	if( typeof date === "object"){
		 var year = date.getFullYear();
		  var month = (1 + date.getMonth()).toString();
		  month = month.length > 1 ? month : '0' + month;
		  var day = date.getDate().toString();
		  day = day.length > 1 ? day : '0' + day;
		  return year + '/' + month + '/' + day;
	}
	
};