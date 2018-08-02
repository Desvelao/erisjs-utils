module.exports.hasRole = function(member,roleName){
  //console.log(member);
  var arrayRoleName;
  if(typeof roleName == 'string'){arrayRoleName = [roleName]}
  else{arrayRoleName = roleName};
  //console.log();
  if(member.roles.length < 1){return false}
    for(role in member.roles){
      for(var i = 0; i < arrayRoleName.length; i++) {
        //console.log(member.guild.roles.get(member.roles[role]).name);
        if(member.guild.roles.get(member.roles[role]).name.toLowerCase() == arrayRoleName[i].toLowerCase()){
          //console.log('True');
          return true
        }
      }
    }
  return false
};
