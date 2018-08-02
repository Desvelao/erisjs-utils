module.exports.loadEmojis = function(guild){
  let emojis = {};
  guild.emojis.forEach(emoji => {emojis[emoji.name.toLowerCase()] = '<:' + emoji.name + ':' + emoji.id + '>'})
  return emojis
}

module.exports.getDefaultChannel = function(guild,bot){
  //console.log(guild);
  var defaultChannel;
    for(var channel of guild.channels.values()) {
      //console.log(channel.name, channel.position, channel.parentID,channel.type,channel.permissionsOf(bot.user.id).has("readMessages"));
      if(channel.id === guild.id){defaultChannel = channel;break}
      //console.log(bot.user.id);
      if(channel.type === 0 && channel.permissionsOf(bot.user.id).has("readMessages") && (!defaultChannel || channel.position < defaultChannel.position)){
        defaultChannel = channel;
      }
    }
    return defaultChannel
}

module.exports.getRole = function(guild,name){
  let arrayName,roles = [];
  if(typeof name === 'string'){arrayName = [name]}
  else(arrayName = name);
  //console.log(guild.roles);
  //console.log('ArrayName',arrayName);
  //var guildRoles = guild.roles.map((r) => {return r}
  //console.log('GuildRoles',arrayName.length);
  for(var i = 0; i < arrayName.length; i++) {
    var guildRoles = guild.roles.find(r=> r.name.toLowerCase() === arrayName[i].toLowerCase())
    //console.log(guildRoles);
    if(guildRoles !== undefined){roles.push(guildRoles)}
  }
  if(roles.length < 1){roles = false}
  return roles
}
