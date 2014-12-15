/**
 * New node file
 */
var user = {name:"zhangs", age:10, 'intro':"He is the world's best players."}, userinfo = '';
for (var p in user) {
    userinfo += p + ':' + user[p] + '  '; 
}
alert(userinfo);
		
delete user.name;
userinfo = '';
for (var p in user) {
    userinfo += p + ':' + user[p] + '  '; 
}
alert(userinfo);