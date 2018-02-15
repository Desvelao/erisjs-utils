const fs = require('fs');
const http = require('http');
const https = require('https');
var util = {}

// ************************************* DATE ***************************
util.date = function(time,mode){
  //mode = mode || 'hour-date'
  const default_format = 's';
  var date = typeof time == 'number' ? new Date(time) : new Date();
  if(typeof time == 'number'){date = new Date(time), mode = mode || default_format}else{date = new Date(), mode = time || default_format}
  var result = '';
  if(['DMY/hms','log'].indexOf(mode) > -1){
    result = util.number.zerofication(date.getDate()) + '/' + util.number.zerofication((date.getMonth()+1)) + '/' + date.getFullYear() + ' ' + util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds())
  }else if(['[DMY/hms]','logdeco'].indexOf(mode) > -1){
    result = '[' + util.number.zerofication(date.getDate()) + '/' + util.number.zerofication((date.getMonth()+1)) + '/' + date.getFullYear() + ' ' + util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds()) + ']'
  }else if(mode == 'hms/DMY'){
    result = util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds()) + ' ' + util.number.zerofication(date.getDate()) + '/' + util.number.zerofication((date.getMonth()+1)) + '/' + date.getFullYear()
  }else if(mode == 'hm/DMY'){
    result = util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ' ' + util.number.zerofication(date.getDate()) + '/' + util.number.zerofication((date.getMonth()+1)) + '/' + date.getFullYear()
  }else if(mode == 's'){
    result = Math.round(date.getTime()/1000)
  }else if(mode == 'ts'){
    result = date.getTime()/1000
  }else if(mode == 'DMY-hms'){
    result = util.number.zerofication(date.getDate()) + '-' + util.number.zerofication((date.getMonth()+1)) + '-' + date.getFullYear() + ' ' + util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds())
  }else if(mode == 'hms-DMY'){
    result = util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds()) + ' ' + util.number.zerofication(date.getDate()) + '-' + util.number.zerofication((date.getMonth()+1)) + '-' + date.getFullYear()
  }else if(mode == 'hms'){
    result = util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ':' + util.number.zerofication(date.getSeconds())
  }
  return result
}

// ************************************* TIME ***************************
util.time = {};

util.time.convert = function(time,mode){
  mode = mode || 's-ms';
  const sg_ms = 1000;
  const m_sg = 60;
  if(mode == 's-ms'){time *= sg_ms}
  else if(mode == 'm-ms'){time *= sg_ms*m_sg}
  else if(mode == 'm-s'){time *= m_sg}
  else if(mode == 's-date'){time = util.date('hour-date',time*sg_ms)}
  //console.log(time);
  return time
}

// ******************************************* STRING MODULE **********************************
util.string = {};

util.string.capitalize = function(string){
  return string.charAt(0).toUpperCase() + string.slice(1)
}

util.string.replace = function(text,dict,arrow){
  //console.log(arguments.length);
  if(dict){
    for (var k in dict) {
      let replaceText = arrow ? '<' + k + '>' : k;
      text = text.replace(new RegExp(replaceText,'g'),dict[k])
    }
  }
  return text
}

util.string.ReplaceWithDictionaryAndLang = function(array_dicts,setArrow,lang){
  function addArrow(value){return '<'+ value + '>'}
  function addDict(dictbase,add,arrow){
    if([true,false].indexOf(arrow) < 0){arrow = true};
    var newDict = Object.assign({},dictbase);
    for (var k in add) {
      newDict[k] = {value : add[k], arrow : arrow}
    }
    return newDict
  }
  var dict = {};
  var lang = lang || false;
  this.addDict = function(add,arrow,category){
    if([true,false].indexOf(arrow) < 0){arrow = true};
    var newAddDict = {};
    if(category){
      for(k in add){
        newAddDict[category+'_'+k] = add[k];
      }
    }else{
      newAddDict = add
    }
    dict = addDict(dict,newAddDict,arrow)
  }
  this.get = function(key){
      //console.log(dict[key],typeof dict[key],dict[key].value);
    return dict[key] !== undefined ? dict[key].value : false
  }
  this.show = function(){
    return console.log(dict);
  }
  this.getraw = function(key){
    return dict[key]
  }

  for (var i = 0; i < array_dicts.length; i++){
    this.addDict(array_dicts[i],setArrow)
    //console.log(array_dicts[i])
  }

  this.set = function(key,value,arrow){
    dict[key] = {value : value, arrow : arrow == undefined ? false : arrow}
  }

  /*this.do = function(message){
    for (var k in dict) {
      let search  = dict[k].arrow ? addArrow(k) : k
      message = message.replace(new RegExp(search,'g'),dict[k].value)
    }
    return message
  }*/
   function replace(message,custom,arrow){
    var _dict;
    if(custom){
      _dict = addDict(dict,custom,arrow);
    }else{
      _dict = dict;
    }
    for (var k in _dict) {
      let search  = _dict[k].arrow ? addArrow(k) : k
      message = message.replace(new RegExp(search,'g'),_dict[k].value)
    }
    return message
  }

  this.do = function(message,custom,arrow){
    return lang[message] ? replace(lang[message],custom,arrow) : replace(message,custom,arrow)
  }
}

// ******************************************* NUMBER MODULE **********************************

util.number = {};

util.number.zerofication = function(text,digits){
  digits = digits || 2;
  text = text.toString();
  if(digits > text.length){
    text = "0".repeat(digits-text.length) + text
  }
  return text
}

util.number.tok = function(number,format,digits){ //Deprecated
  digits = digits || 1
  format = format || 1000
  return (number/format).toFixed(digits)
}

util.number.random = function(min,max){
  return max !== undefined ? Math.floor(Math.random()*(max - min) + min) : Math.floor((Math.random() * min) + 1);
}

// *************************** COLOR MODULE **********************

util.color = {};

util.color.convert = function(color,mode){
  mode = mode || 'hex-int';
  if(mode === 'hex-int'){color = parseInt(color.replace(/^#/, ''), 16)}
  return color
}

util.color.get = function(color,converted){
  const myColor = myColors[color] || myColors['black']
  if(converted){
    return util.color.convert(myColors[color],'hex-int')
  }
  return myColor
}

util.color.random(converted){
    const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    if(converted === 'int'){return util.color.convert(randomColor,'hex-int')}
    return randomColor
}

util.color.myRandom(converted){
  const colors = Object.keys(myColors)
  const color = colors[Math.floor(Math.random()*colors.length)]
  if(converted){return util.color.convert(color)}else{return color}
}

const myColors = {
  red : '#FF0000', green : '#00FF00', blue : '#0000FF', white : '#FFFFFF', black : '#000000'
}

// ******************************************* CMD MODULE **********************************

util.cmd = {};

util.cmd.noprefix = function(message,prefix){
  return message.slice(prefix.length);
}

util.cmd.split = function(message,prefix){
  return util.cmd.noprefix(message,prefix).split(' ');
}

util.cmd.joinFrom = function(message,command){
  const capture = message.match(new RegExp(command));
  if(capture){
    message = message.substring(capture.index+command.length+1);
  }
  return message
}

util.cmd.load = function(load){ //Load path to json or Dictionaty object (s object to subcommands) Multiple Levels
  var commands = {};
  if(typeof load == 'object'){
    for (var i in load){
      commands[i] = {cmd : i};
      for (var j in load[i]) {
        if(j != 's'){commands[i][j] = load[i][j]}
        else{
          commands[i][j] = util.cmd.load(load[i][j])
        };
      }
    }
  }else{
    commands = util.cmd.load(require(load));
  }
  //console.log(commands);
  return commands
}

// *************************** REQUEST MODULE **********************
util.request = {};

util.request.getJSON = function(url){
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    // console.log(url);
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      //  console.log('Test');
      // temporary data holder
      var chunks = '';
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {chunks += chunk});
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        // console.log('end');
        // console.log(chunks);
        resolve(JSON.parse(chunks));
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    request.end();
    })
}

util.request.getJSONMulti = function(urls,results){
  // var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  // console.log(results);
  var promises = [];
  for (var i = 0; i < urls.length; i++) {
    promises.push(util.request.getJSON(urls[i]))
  }
  return Promise.all(promises)
}

util.request.getJSON2 = function(urls,results){
  var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  // console.log(results);
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    // console.log(url);
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      //  console.log('Test');
      // temporary data holder
      var chunks = '';
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {chunks += chunk});
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        // console.log('end');
        results.push(JSON.parse(chunks));
        // console.log(urls);
        if(urls.length){
          // console.log(urls,results);
          setTimeout(function(){util.request.getJSON(urls,results)},200);
        }else{
          // console.log(results);
          resolve(results);
        }
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    request.end();
    })
}

util.request.post = function (options,reqBody){
  //options = {host,path} , reqBody =
  //reqBody = '{"value1" : "E1", "value2" : "T", "value3" : "Z"}'
  options.headers = {'content-type' : 'application/json','content-length':reqBody.length};
      //host : "maker.ifttt.com", //--https://maker.ifttt.com/
  options.method = 'POST';
  options.body = reqBody;
      //port = 443,
      //body = { value1 = "E1", value2 = "T", value3 = "Z" },
      //path : "/trigger/eventmaker/with/key/WHVo4sC6HaYu3jQhickOj"
  const req = https.request(options, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.write(options.body);
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
}

util.request.postIFTTT = function(){ //EXPERIMENTAL
  const reqBody = '{"value1" : "E1", "value2" : "T", "value3" : "Z"}'
  const options = {
      host : "maker.ifttt.com", //--https://maker.ifttt.com/
      headers : {'content-type' : 'application/json','content-length':reqBody.length},

      //--headers = {{'content-type' , 'application/json'},
      method : 'POST',
      //port = 443,
      body : reqBody,
      //body = { value1 = "E1", value2 = "T", value3 = "Z" },
      path : "/trigger/eventmaker/with/key/WHVo4sC6HaYu3jQhickOj"
    };
  //console.log(url,results);
  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  console.log(options.body);
  req.write(options.body);
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
}

// *************************** GUILD MODULE **********************

util.guild = {}

util.guild.loadEmojis = function(guild){
  let emojis = {};
  guild.emojis.forEach(emoji => {emojis[emoji.name.toLowerCase()] = '<:' + emoji.name + ':' + emoji.id + '>'})
  return emojis
}

util.guild.getDefaultChannel = function(guild){
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

util.guild.getRole = function(guild,name){
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

// *************************** ROLE MODULE **********************

util.role = {};

util.role.get = function(guild,name){
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

// *************************** MEMBER MODULE **********************

util.member = {};

util.member.hasRole = function(member,roleName){
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

// *************************** FIREBASE MODULE **********************

util.firebase = {};

util.firebase.backupDBfile = function(db,bot,channel,backup){
  return new Promise((resolve, reject) => {
    db.once('value').then((snap) => {
      if(!snap.exists()){return};
      snap = snap.val();
      let dateformat = 'DMY/hms';
      let buff = new Buffer(JSON.stringify(snap));
      let filename = `${backup.filenameprefix}${util.date(dateformat)}.json`.replace(/ /g,"_");
      bot.createMessage(channel,{content : `${backup.messageprefix} \`${util.date(dateformat)}\``},{file : buff, name : filename}).then(message => resolve(message)).catch((error) => reject(error))
      resolve(snap)
    })
  })
}

util.firebase.loadRemember = function(db,path,fn){
  const loaddays = 2;
  db.child(path).once('value').then((snap) => {
    // console.log(snap.val());
    if(!snap.exists() || snap.val().length < 1){return};
    snap = snap.val();
    Object.keys(snap).forEach(function(k) {
      k = parseInt(k);
      if(isNaN(k)){return};
      var diffTime = k - util.date();
      // console.log(diffTime,k,util.date());
      if(diffTime < 1){db.child(`${path}/${k}`).remove()}
      else if(diffTime > loaddays*24*60*60){return}
      else{
        console.log(`Recordatorio Cargado [${path}/${k}] en ${diffTime} s`);
        // setTimeout(() => {bot.createMessage(settings.guild.text.anuncios,snap[k]);settings.db.child(`remember/${k}`).remove()},diffTime*1000)
        setTimeout(function(){
          db.child(`${path}/${k}`).once('value').then((shot) => {
            if(!shot.exists()){return};
            db.child(`${path}/${k}`).remove();
            let output;
            if(typeof shot.val() === 'object'){
              output = shot.val()
              output._key = shot.key;
            }else{
              output = {_key : shot.key, _value : shot.val()}
            }
            fn(output);
          })},diffTime*1000);
      }
    });
  })
}

// *************************** STEAM MODULE **********************

util.steam = {};
const steamlinks = {profiles : 'http://steamcommunity.com/profiles/', id : 'http://steamcommunity.com/id/'}

util.steam.idToUrl = function(id){
  return (id.match(new RegExp('[^0-9]')) ? steamlinks.id : steamlinks.profiles) + id
}

util.steam.idToLink = function(id,hide,text){
  return hide ? `[${text ? text : id}](${util.steam.idToUrl(id)})` : `[${text ? text : id}](${util.steam.idToUrl(id)}) \`${util.steam.idToUrl(id)}\``
}

util.steam.idToSteamID = function(id32){

  const cv64 = '76561197960265728';
  id32 = util.number.zerofication(id32,cv64.length);
  //console.log('cv64length',cv64.length,id32.length);
  var result = [];
  var carry = 0;
  var sum1,sum2 = 0;
  var sump = 0

  for (var i = cv64.length - 1 ; i >= 0; i--) {
    sum1 = parseInt(id32[i]) || 0;
    sum2 = parseInt(cv64[i]);
    sump = sum1 + sum2 + carry
    if(sump > 9){carry = 1;sump -= 10}else{carry = 0}
    result[i] = sump
    //console.log(`${sum1} + ${sum2} = ${parseInt(sum1)+parseInt(sum2)} / ${result[i]}  con carry ${carry}`);
  }
  var total = result.join('')
  //console.log('Total: ' + total)
  return total
  /*for (var i = id64.length - 1 ; i > 0; i--) {
    console.log(i + ':' + id64[i]);
  }*/
}

util.steam.idToDotaID = function(id64){
  const cv64 = '76561197960265728';
  //id64 = id64.toString()
  var result = [];
  var carry = 0;
  var min,sus = 0;
  for (var i = id64.length - 1 ; i > 0; i--) {
    min = parseInt(id64[i]);
    sus = parseInt(cv64[i]);
    sus = sus + carry;
    if(min < sus){carry = 1;min = 10+min}else{carry = 0};
    if(sus == 0){carry = 1};
    result[i] = min - sus;
    //console.log(min,sus,result[i],carry);
  }
  var total = parseInt(result.join('')).toString();
  //console.log('Total: ' + total)
  return total
  /*for (var i = id64.length - 1 ; i > 0; i--) {
    console.log(i + ':' + id64[i]);
  }*/
}

// *************************** DOTA MODULE **********************

util.dota = {};
const dotalinks = {dotabuff : 'https://www.dotabuff.com/players/'}

util.dota.idToUrl = function(id,mode){
  return (dotalinks[mode] ? dotalinks[mode] : '') + id
}

util.dota.idToLink = function(id,hide,text){
  return hide ? `[${text ? text : id}](${util.dota.idToUrl(id)})` : `[${text ? text : id}](${util.dota.idToUrl(id)}) \`${util.dota.idToUrl(id)}\``
}

// *************************** FILE MODULE **********************

util.file = {};

util.file.listDir = function(path){
  fs.access('path', (err) => {
    if (err) {
      //console.error("myfile doesn't exists");
      return;
    }});
  var files = fs.readdirSync(path)
  //console.log(files);
  return files
}

// *************************** MD (Markdown) MODULE **********************

util.md = {};

util.md.link = function(link,text,mode){
  if(mode === 'embed+link'){
    return `[${text}](${link}) \`${link}\``
  }if(mode === 'embed+text'){
    return `[${text}](${link}) \`${text}\``
  }else{
    return `[${text}](${link})`
  }
}

util.md.Discord = function(content){
  this.content = content || '';
  this.text = function(text,ps){return this.content};
  this.add = function(text,ps){this.content += `${checkspace(this,ps)}${text}`;return this};
  this.link = function(link,text,mode,ps){this.content += `${checkspace(this,ps)}${util.md.link(link,text,mode)}`;return this};
  this.cursive = function(text,ps){this.content += `${checkspace(this,ps)}*${text}*`;return this};
  this.bold = function(text,ps){this.content += `${checkspace(this,ps)}**${text}**`;return this};
  this.boldcursive = function(text,ps){this.content += `${checkspace(this,ps)}***${text}***`;return this};
  this.sub = function(text,ps){this.content += `${checkspace(this,ps)}__${text}__`;return this};
  this.subcursive = function(text,ps){this.content += `${checkspace(this,ps)}__*${text}*__`;return this};
  this.subbold = function(text,ps){this.content += `${checkspace(this,ps)}__**${text}**__`;return this};
  this.subboldcursive = function(text,ps){this.content += `${checkspace(this,ps)}__***${text}***__`;return this};
  this.code = function(text,ps){this.content += `${checkspace(this,ps)}\`${text}\``;return this};
  this.codeblock = function(text,ps){this.content += `${checkspace(this,ps)}\`\`\`${text}\`\`\``;return this};
  this.tab = function(n){this.content += `${'    '.repeat(n || 1)}${text}`;return this};
  this.s = function(){this.content += ` `;return this};
  this.n = function(newlines){this.content += `\n`.repeat(newlines || 1);return this};
  this.log = function(){console.log(this.content);return this};
  this.checknl = function(){console.log(newline(this) ? 'Nueva línea' : 'Nada');return this};
  this.last = function(){console.log(this.content.slice(-2),this.content.slice(-2).length);return this};
  this.toChars = function(){return this.content.split('')};
  this.nl = function(){return this.content.slice(-1) === '\n'};
  prev = function(ps){return ps ? '' : ' '};
  newline = function(that){return that.content.slice(-1) === '\n'};
  checkspace = function(that,ps){return newline(that) ? '' : prev(ps)}
}

// *************************** MSG MODULE **********************

util.msg = {};

util.msg.create = function(msg,message,time){
  time = time || 0
  msg.channel.sendTyping().then(() => {setTimeout(() => {msg.channel.createMessage(message)},time*1000)})
}

util.msg.createDM = function(msg,message,time){
  time = time || 0
  msg.author.getDMChannel().then((channel) => {
    channel.sendTyping().then(() => {setTimeout(() => {channel.createMessage(message)},time*1000)})
  })
}

util.msg.guilds = function(bot,message,file){
  const guilds = bot.guilds.map((g) => {return g.defaultChannel.id});
  for (var i = 0; i < guilds.length; i++) {
    bot.sendChannelTyping(guilds[i]);
    bot.createMessage(guilds[i],message,file);
  }
}

util.msg.sendImage = function(urls,results,container,callback){
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

// *************************** TABLE MODULE **********************

util.table = {};

util.table.new = function(array,spaces,refill){
  var config = {array : [array], spaces : spaces,refill : refill, title : array}
  this.addRow = function(array){config.array.push(array)}
  this.do = function(){return util.table.create(config.array,config.spaces,config.refill)};
  this.doTitle = function(){
    let text = util.table.row(title,config.spaces);
    let newArray = config.array;
    newArray.shift();
    text += util.table.create(newArray,config.spaces,config.refill);
    return text
  }
  this.showTable = function(){console.log(config.array);}
}

util.table.create = function(array,spaces,refill){
  //array[0] debe ser el título
  var text = '';
  for (let i = 0; i < array.length; i++) {
    //console.log(array[i],spaces);
    text += util.table.row(array[i],spaces,refill);
  }
  return text
}

util.table.rowRaw = function(array,spaces,refill){
  return util.table.row(array,spaces,refill).replace('\n','')
}

util.table.row = function(array,spaces,refill){
  //array = [celda1(string),celda2(string),....]
  //spaces = [spaces[align(l/c/d)][fill(f)]] => example [4rf,5f]
  //refill = string refill blankspaces
  fill = refill || " ";
  var blank = " ";
  //[{space : number, align : 'l/c/r'}]
  var result = '`';
  //console.log('Test');
  for (var i = 0; i < array.length; i++) {
    if(array[i] === null || array[i] === undefined){array[i] = '........'}
    array[i] = array[i].toString();
    var space = spaces[i].match(new RegExp('(\\d*)'))[1];
    var align = spaces[i].match(new RegExp('(l|r|c)')) ? spaces[i].match(new RegExp('(l|r|c)'))[1] : 'l';
    var fillSpace = spaces[i].match(new RegExp('(f)')) ? true : false;
    //console.log(array[i],space,align,fillSpace);
    if(array[i].length < space){
      //text = array[i]
      var dif = space - array[i].length
      if(align == 'l'){
        result += array[i];
        //result += array[i] + fill.repeat(space - array[i].length);
        if(fillSpace && refill && dif - 1 > 0 ){result += blank; dif--};
        if(fillSpace && refill){result += fill.repeat(dif)}else{result += blank.repeat(dif)};

      }else if(align == 'r'){
        //console.log(spaces[i] - array[i].length);
        if(fillSpace && refill && dif - 1 > 0 ){result += fill.repeat(dif-1) + blank.repeat(1) + array[i]}
        else{result += blank.repeat(dif) + array[i]};
        //if(fillSpace && refill){result += fill.repeat(dif) + array[i]}else{result += blank.repeat(dif) + array[i]};
        //result += fill.repeat(dif) + array[i];
      }else if(align == 'c'){
        //console.log(spaces[i] - array[i].length);
        let spacerest = dif%2;
        let spaceside = Math.trunc(dif/2);
        if(fillSpace && refill && dif - 1 > 0 ){result += fill.repeat(spaceside + spacerest-1) + blank + array[i] + blank + fill.repeat(spaceside-1)}
        else{result += blank.repeat(spaceside + spacerest) + array[i] + blank.repeat(spaceside)};
        //if(fillSpace && refill){result += fill.repeat(dif) + array[i]}else{result += blank.repeat(dif) + array[i]};
        //result += fill.repeat(dif) + array[i];
      }
    }else{
      //text = array[i].slice(0,spaces[i])
      result += array[i].slice(0,space);
    }
    result += blank;
  };
  result += '`\n'
  return result
}

// *************************** U (UTIL) MODULE **********************

util.u.errorReadKey = function(key){
  try{
    console.log(key + ' está correcta');
  }catch(err){
    console.log('Error Read Key: ' + err);
  }
}

util.u.test = function(){
  console.log('Testing');
}

// *************************** ITERATORS **********************

util.iterator = {};

util.iterator.dictToArray = function* (dict) {
    const keys = Object.keys(dict)
    var array = [];
    for (var i = 0; i < keys.length; i++) {
      array[i] = dict[keys[i]]
    }
    let id = 0
    while(id < array.length){
      yield array[id++]
      //id++
    }
}

// *************************** FN (Functions Complete) MODULE **********************

util.fn = {};

util.fn.help = function(msg,cmds,prefix,title,help,categories,dm,replace){
  var commands = {};
  for (var cmd in cmds) {
    if(!commands[cmds[cmd].category]){commands[cmds[cmd].category] = []};
    commands[cmds[cmd].category].push(cmds[cmd]);
  }
  for(cat in commands){
    commands[cat] = commands[cat].sort(function(a,b){if(a.cmd < b.cmd){return -1}else if(a.cmd > b.cmd){return 1}else{return 0}});
  };
  //console.log(commands);
  //var categories = [];
  if(categories.length < 1){
    for(cat in commands){
      categories.push(cat)
    };
  }
  //console.log(commands);
  //console.log(categories);
  //return
  var text = title + '\n\n';
  if(help){text += help + '\n\n'};
  for (var cat = 0; cat < categories.length; cat++) {
    text += `**${util.string.capitalize(categories[cat])}**\n\n`
    const category = commands[categories[cat]];
    //console.log(category);
    for (var cmd = 0; cmd < category.length; cmd++) {
      if(category[cmd].hide){continue};
      text += `\`${prefix + category[cmd].cmd}${category[cmd].arguments ? ' ' + category[cmd].arguments : ''}\` - ${replace ? replace.do(category[cmd].description) : category[cmd].description}\n`;
      if(!category[cmd].s){continue};
      var array_subcommands = Object.keys(category[cmd].s).sort();

      for (var scmd = 0; scmd < array_subcommands.length; scmd++) {
        text += `     · \`|${category[cmd].s[array_subcommands[scmd]].cmd}${category[cmd].s[array_subcommands[scmd]].arguments ? ' ' + category[cmd].s[array_subcommands[scmd]].arguments + '|' : '|'}\` - ${replace ? replace.do(category[cmd].s[array_subcommands[scmd]].description) : category[cmd].s[array_subcommands[scmd]].description}\n`
      }
      //text += '\n';
    }
    text += '\n';
  }
  //console.log(text,text.length);
  //console.log(text);
  //console.log('channel',msg.channel.type);
  if(dm){
    if(msg.channel.type === 0){util.msg.createDM(msg,text)}else{util.msg.create(msg,text)}
  }
  //setTimeout(() => {msg.delete()},game.waitToDelete);
}

util.fn.wrongCmd = function(msg,table,config){
  //config = {cmd,premsg,cmdprefix,charslimit,dm}
  // @charslimit === 0 => no dm
  var cmd = config.cmd;
  var arrayKeys = []
  if(!Array.isArray(table)){
    arrayKeys = Object.keys(table).sort();
  }else{
    arrayKeys = table.sort();
  }
  const text = config.premsg + ' `' + config.cmdprefix + config.cmd + '` |' + arrayKeys.map(k => `\`${k}\``).join(', ') + '|';
  const charslimit = config.charslimit || 500;
  if(config.dm || (msg.channel.type === 0 && text.length > charslimit && charslimit !== 0)){
    msg.author.getDMChannel().then((channel) => {channel.createMessage(text)})
  }else{msg.channel.createMessage(text)}
}

util.fn.roll = function(msg,config,cmd){
  if(!cmd.enable){return};
  var command = util.cmd.split(msg.content,config.prefix);
  var min, max, random;
  //console.log(command);
  if(command.length == 1){
    min = 1;
    max = 6;
    random = Math.floor((Math.random() * max) + 1);
  }else if(command.length == 2){
    command[1] = parseInt(command[1]);
    if(typeof command[1] !== 'number' || isNaN(command[1])){return}
    min = 1;
    max = command[1];
    if(min > max){return};
    random = Math.floor((Math.random() * max) + 1);
  }else if(command.length == 3){
    command[1] = parseInt(command[1]);
    command[2] = parseInt(command[2]);
    //console.log(command[1],typeof command[1]);
    //console.log(command[2],typeof command[2]);
    if(typeof command[1] !== 'number' || isNaN(command[1]) || typeof command[2] !== 'number' || isNaN(command[2])){return};
    min = command[1];
    max = command[2];
    if(min > max){return};
    random = Math.round(Math.random()*(max - min) + min);
  }
  util.msg.create(msg,`:game_die: **(${min}-${max}) | ${msg.author.username}** has obtenido un **${random}**`);
}

util.fn.messageFollowTemplate = function(msg,template,callback){
    let message = msg.content;
    let pass = false;
    //let pat = new RegExp("(.*)⚔(.*)\\n🗓 (\\d\\d:\\d\\d) ⏰ (\\d\\d:\\d\\d)\n🏆(.*)","g") //🏆⏰⚔ 🗓
    if(Array.isArray(template)){
      template.forEach(t => {
        if(message.match(new RegExp(t,"g"))){pass = true}
      })
    }else if(typeof(template) === 'string'){
      if(message.match(new RegExp(template,"g"))){pass = true}
    }
    if(!pass){callback()};
    // if(message.match(new RegExp(template,"g"))){
    //   //msg.addReaction(settings.emojis.default.accept);
    // }else{
    //   callback()
    // }
    //let pat = /:smile: (\n)/gm
}

util.fn.logfrom = function(msg){
  if(msg.channel.type === 0){
    console.log(util.date('logdeco') + ' - |' + msg.channel.guild.name + '| <' + msg.author.username + '> - ' + msg.content)
  }else{
    console.log(util.date('logdeco') + ' - |DM| <' + msg.author.username + '> - ' + msg.content)
  };
}

util.fn.showPics = function(msg,config,pics,query,command){
  //TODO: rehacer y comprobar
  if(!command.enable){return}
  if(!pics[query] || query.length < 1){
    util.fn.wrongCmd(msg,pics,config);
    return
  };
  msg.channel.sendTyping().then(() => {
    if(typeof pics[query] == 'object'){
      util.msg.sendImage([pics[query].file],[],{msg : msg, config : config, pics : pics, query : query},function(results,container){
        //console.log('Hola',results);
        msg.channel.createMessage(util.string.replace(pics[query].msg, {author : msg.author.username},true),{file : results, name : pics[query].name});
        //util.msg.create()
      })
    }else{
      util.msg.create(msg,util.string.replace(pics[query], {author : msg.author.username},true));
    }
  })
};

// *************************** EXPERIMENTAL **********************

util.class = {};

util.createCommand = function(cmd,fn){
  //this = {};
  //console.log(cmd);
  this.command = cmd.cmd;
  this.description = cmd.cmd;
  this.enable = cmd.enable;
  var fn = fn;
  fn()
  this.fn = () =>{
    if(this.enable){fn()}
  }
  this.cmd = function(){return this.command}
  //console.log(this);
}

util.class.p = class{
  constructor(name,lastname){
    this.name = name;
    this.lastname = lastname;
  };
  saluda(){
    console.log(this.name + ' ' + this.lastname);
  };
}

// ************************************* TO BE DEPRECATED/REDONE ***************************
util.JsonLoad2 = function(path){
  var obj
  fs.readFile(path, 'utf8', function(err, data) {
      if (err) throw err;
      console.log(data)
      obj = JSON.parse(data)
      //console.log(typeof obj)
      return obj
  })
}

util.JsonLoad = function(file){
  var obj = JSON.parse(fs.readFileSync(file,'utf8'))
  return obj
}

util.JsonSave = function(file,data){
  fs.writeFileSync(file, JSON.stringify(data), 'utf8')
}

util.webRequest = function(url){
  //console.log(url,results);
  https.get(url,function(res){
      var chunks = '';
    res.on('data',function(d){
      chunks += d;
      return JSON.parse(chunks);
    });
    res.on('end',function(){
      //console.log(chunks);
      console.log(JSON.parse(chunks));

    });
  }).on('error', (e) => {
    console.error(e);
  });
}

util.webRequestMulti = function(urls,results,container,callback){ //DEPRECATED
  var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  https.get(url,function(res){
      var chunks = '';
    res.on('data',function(d){
      chunks += d;
    });
    res.on('end',function(){
      results.push(JSON.parse(chunks));
      if(urls.length){
        setTimeout(function(){util.webRequestMulti(urls,results,container,callback)},200);
      }else{
        callback(results,container);
      }
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

util.webRequestMultiT = function(urls,results,container,callback){ //DEPRECATED
  var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  https.get(url,function(res){
      var chunks = '';
    res.on('data',function(d){
      chunks += d;
      console.log(chunks);
    });
    res.on('end',function(){
      results.push(chunks);
      if(urls.length){
        setTimeout(function(){util.webRequestMulti(urls,results,container,callback)},200);
      }else{
        callback(results,container);
      }
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

// ************************************* DEPRECATED ***************************
util.numberToK = function(number,format,digits){ //Deprecated
  digits = digits || 1
  format = format || 1000
  return (number/format).toFixed(digits)
}

util.zeroficationNumber = function(text,digits){ //Deprecated
  digits = digits || 2;
  text = text.toString();
  //console.log(text,text.length,digits);
  if(digits > text.length){
    text = "0".repeat(digits-text.length) + text
  }
  //console.log(text);
  return text
}

util.random = function(min,max){
  return max !== undefined ? Math.floor(Math.random()*(max - min) + min) : Math.floor((Math.random() * min) + 1);
}

util.strCapitalize = function(string){
  return string.charAt(0).toUpperCase() + string.slice(1)
}

util.msgNoPrefix = function(message,prefix){
  return message.slice(prefix.length)
}

util.msgCommand = function(message,prefix){
  return util.msgNoPrefix(message,prefix).split(' ')
}

util.substringFromCommand = function(message,command){
  let capture = message.match(new RegExp(command));
  if(capture){
    message = message.substring(capture.index+command.length+1);
  }
  return message
}

util.DateF = function(time){
  var d;
  if(time){d = new Date(time)}
  else{d = new Date()}
  return '['+ util.number.zerofication(d.getDate()) + '-' + util.number.zerofication((d.getMonth()+1)) + '-' + d.getFullYear() + ' ' + util.number.zerofication(d.getHours()) + ':' + util.number.zerofication(d.getMinutes()) + ']'
}

util.Date = function(time){
  var d;
  if(time){d = new Date(time)}
  else{d = new Date()}
  return {day: d.getDate(), month : util.number.zerofication((d.getMonth()+1)), year : d.getFullYear(), hour : d.getHours(), min : d.getMinutes()}
}

util.DateS = function(){
  return Math.round((new Date().getTime())/1000)
}

util.replace = function(text,dict,arrow){
  //console.log(arguments.length);
  if(dict){
    for (var k in dict) {
      let replaceText = arrow ? '<' + k + '>' : k;
      text = text.replace(new RegExp(replaceText,'g'),dict[k])
    }
  }
  return text
}

util.replaceUndNull = function(key,replaceWith){
  //console.log(key);
  if((key === undefined) || (key === null)){
    //console.log('UndNull');
    key = replaceWith};
  return key
}

util.defined = function(value){
  return value !== undefined
}

util.getGuildDefaultChannel = function(guild){
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

util.getGuildRoleName = function(guild,name){
  var arrayName;
  var roles = [];
  if(typeof name == 'string'){arrayName = [name]}
  else(arrayName = name);
  //console.log(guild.roles);
  //console.log('ArrayName',arrayName);
  //var guildRoles = guild.roles.map((r) => {return r})
  var roles = []
  //console.log('GuildRoles',arrayName.length);
  for(var i = 0; i < arrayName.length; i++) {
    var guildRoles = guild.roles.find(r=> r.name.toLowerCase() === arrayName[i].toLowerCase())
    //console.log(guildRoles);
    if(guildRoles !== undefined){roles.push(guildRoles)}
  }
  //console.log('Roles');
  //console.log(roles);
  /*for(role in guildRoles){
    console.log('Role',role,guild.roles[role].name);
    for(var i = 0; i < arrayName.length; i++) {
      console.log('Roles names',role.name.toLowerCase(),arrayName[i].toLowerCase());
      if(guildRoles[role].name.toLowerCase() == arrayName[i].toLowerCase()){
        //console.log('Role');
        roles.push(guildRoles[role])
      }
    }
  }*/
  if(roles.length < 1){roles = false}
  return roles
}

util.roleByName = function(member,roleName){
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

util.convertColor = function(color,mode){
  mode = mode || 'hex';
  if(mode == 'hex'){color = parseInt(color.replace(/^#/, ''), 16)}
  //else if(mode == 'm-ms'){time *= sg_ms*m_sg}
  //console.log(time);
  return color
}

util.loadCmds = function(load){ //Load path to json or Dictionaty object (s object to subcommands) Multiple Levels
  var commands = {};
  if(typeof load == 'object'){
    for (var i in load){
      commands[i] = {cmd : i};
      for (var j in load[i]) {
        if(j != 's'){commands[i][j] = load[i][j]}
        else{
          commands[i][j] = util.loadCmds(load[i][j])
        };
      }
    }
  }else{
    commands = util.loadCmds(require(load));
  }
  //console.log(commands);
  return commands
}

util.convertTime = function(time,mode){
  mode = mode || 's-ms';
  const sg_ms = 1000;
  const m_sg = 60;
  if(mode == 's-ms'){time *= sg_ms}
  else if(mode == 'm-ms'){time *= sg_ms*m_sg}
  else if(mode == 'm-s'){time *= m_sg}
  else if(mode == 's-date'){time = util.date('hour-date',time*sg_ms)}
  //console.log(time);
  return time
}

util.help = function(msg,cmds,prefix,title,help,categories,dm,replace){
  var commands = {};
  for (var cmd in cmds) {
    if(!commands[cmds[cmd].category]){commands[cmds[cmd].category] = []};
    commands[cmds[cmd].category].push(cmds[cmd]);
  }
  for(cat in commands){
    commands[cat] = commands[cat].sort(function(a,b){if(a.cmd < b.cmd){return -1}else if(a.cmd > b.cmd){return 1}else{return 0}});
  };
  //console.log(commands);
  //var categories = [];
  if(categories.length < 1){
    for(cat in commands){
      categories.push(cat)
    };
  }
  //console.log(commands);
  //console.log(categories);
  //return
  var text = title + '\n\n';
  if(help){text += help + '\n\n'};
  for (var cat = 0; cat < categories.length; cat++) {
    text += `**${util.string.capitalize(categories[cat])}**\n\n`
    const category = commands[categories[cat]];
    //console.log(category);
    for (var cmd = 0; cmd < category.length; cmd++) {
      if(category[cmd].hide){continue};
      text += `\`${prefix + category[cmd].cmd}${category[cmd].arguments ? ' ' + category[cmd].arguments : ''}\` - ${replace ? replace.do(category[cmd].description) : category[cmd].description}\n`;
      if(!category[cmd].s){continue};
      var array_subcommands = Object.keys(category[cmd].s).sort();

      for (var scmd = 0; scmd < array_subcommands.length; scmd++) {
        text += `     · \`|${category[cmd].s[array_subcommands[scmd]].cmd}${category[cmd].s[array_subcommands[scmd]].arguments ? ' ' + category[cmd].s[array_subcommands[scmd]].arguments + '|' : '|'}\` - ${replace ? replace.do(category[cmd].s[array_subcommands[scmd]].description) : category[cmd].s[array_subcommands[scmd]].description}\n`
      }
      //text += '\n';
    }
    text += '\n';
  }
  //console.log(text,text.length);
  //console.log(text);
  //console.log('channel',msg.channel.type);
  if(dm){
    if(msg.channel.type === 0){util.msg.createDM(msg,text)}else{util.msg.create(msg,text)}
  }
  //setTimeout(() => {msg.delete()},game.waitToDelete);
}

util.checkExistKey = function(keys){
  var check = true;
  for (var i = 0; i < keys.length; i++) {
    if((keys[i] === undefined) || (keys[i] === null)) {check = false; break};
  }
  return check
}

util.listDir = function(path){
  fs.access('path', (err) => {
    if (err) {
      //console.error("myfile doesn't exists");
      return;
    }});
  var files = fs.readdirSync(path)
  //console.log(files);
  return files
}

util.ReplaceWithDictionaryAndLang = function(array_dicts,setArrow,lang){
  function addArrow(value){return '<'+ value + '>'}
  function addDict(dictbase,add,arrow){
    if([true,false].indexOf(arrow) < 0){arrow = true};
    var newDict = Object.assign({},dictbase);
    for (var k in add) {
      newDict[k] = {value : add[k], arrow : arrow}
    }
    return newDict
  }
  var dict = {};
  var lang = lang || false;
  this.addDict = function(add,arrow,category){
    if([true,false].indexOf(arrow) < 0){arrow = true};
    var newAddDict = {};
    if(category){
      for(k in add){
        newAddDict[category+'_'+k] = add[k];
      }
    }else{
      newAddDict = add
    }
    dict = addDict(dict,newAddDict,arrow)
  }
  this.get = function(key){
      //console.log(dict[key],typeof dict[key],dict[key].value);
    return dict[key] !== undefined ? dict[key].value : false
  }
  this.show = function(){
    return console.log(dict);
  }
  this.getraw = function(key){
    return dict[key]
  }

  for (var i = 0; i < array_dicts.length; i++){
    this.addDict(array_dicts[i],setArrow)
    //console.log(array_dicts[i])
  }

  this.set = function(key,value,arrow){
    dict[key] = {value : value, arrow : arrow == undefined ? false : arrow}
  }

  /*this.do = function(message){
    for (var k in dict) {
      let search  = dict[k].arrow ? addArrow(k) : k
      message = message.replace(new RegExp(search,'g'),dict[k].value)
    }
    return message
  }*/
   function replace(message,custom,arrow){
    var _dict;
    if(custom){
      _dict = addDict(dict,custom,arrow);
    }else{
      _dict = dict;
    }
    for (var k in _dict) {
      let search  = _dict[k].arrow ? addArrow(k) : k
      message = message.replace(new RegExp(search,'g'),_dict[k].value)
    }
    return message
  }

  this.do = function(message,custom,arrow){
    return lang[message] ? replace(lang[message],custom,arrow) : replace(message,custom,arrow)
  }
}
// ******************************************* DEPRECATED **********************************


module.exports = util
