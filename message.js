const https = require('https')
const http = require('http')

module.exports.create = function(msg,message,time){
  time = time || 0
  msg.channel.sendTyping().then(() => {setTimeout(() => {msg.channel.createMessage(message)},time*1000)})
}

module.exports.createDM = function(msg,message,time){
  time = time || 0
  msg.author.getDMChannel().then((channel) => {
    channel.sendTyping().then(() => {setTimeout(() => {channel.createMessage(message)},time*1000)})
  })
}

module.exports.guilds = function(bot,message,file){
  const guilds = bot.guilds.map((g) => {return g.defaultChannel.id});
  for (var i = 0; i < guilds.length; i++) {
    bot.sendChannelTyping(guilds[i]);
    bot.createMessage(guilds[i],message,file);
  }
}

module.exports.sendImage_ = function(urls,results,container,callback){
  var url = urls.shift();
  var results = results || [];
  if(url.startsWith("https")){
    //if(container){'Petition'};
    https.get(url,function(res){
        var data = [];
      res.on('data',function(d){
        data.push(d);
      });
      res.on('end',function(){
        var buffer = Buffer.concat(data);
        //console.log(buffer.toString('base64'));
        callback(buffer,container);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  }else if(url.startsWith("http")){
    //if(container){'Petition'};
    http.get(url,function(res){
        var data = [];
      res.on('data',function(d){
        data.push(d);
      });
      res.on('end',function(){
        var buffer = Buffer.concat(data);
        //console.log(buffer.toString('base64'));
        callback(buffer,container);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  }
}

module.exports.sendImage = function(url){
  return new Promise((resolve, reject) => {
    if(url.startsWith("https")){
      //if(container){'Petition'};
      https.get(url,function(res){
        var data = [];
        res.on('data',function(d){
          data.push(d);
        });
        res.on('end',function(){
          var buffer = Buffer.concat(data);
          //console.log(buffer.toString('base64'));
          resolve(buffer);
        });
      }).on('error', (e) => {
        reject(e);
      });
    }else if(url.startsWith("http")){
      //if(container){'Petition'};
      http.get(url,function(res){
          var data = [];
        res.on('data',function(d){
          data.push(d);
        });
        res.on('end',function(){
          var buffer = Buffer.concat(data);
          //console.log(buffer.toString('base64'));
          resolve(buffer);
        });
      }).on('error', (e) => {
        reject(e);
      });
    }
  })
}
