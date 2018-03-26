const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');
var util = {}

// ************************************* DATE ***************************
util.date = function(time,mode){
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
  }else if(mode == 'hm/DM'){
    result = util.number.zerofication(date.getHours()) + ':' + util.number.zerofication(date.getMinutes()) + ' ' + util.number.zerofication(date.getDate()) + '/' + util.number.zerofication((date.getMonth()+1))
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

util.dateCustom = function(time,mode,zero){
  let date = typeof time == 'number' ? new Date(time) : new Date();
  const defaultModes = {
    ts : function(date){return Math.round(date.getTime()/1000)},
  }
  const replacement = {
    D : function(date){return date.getDate()},
    M : function(date){return date.getMonth()+1},
    Y : function(date){return date.getFullYear()},
    y : function(date){return date.getFullYear().toString().slice(-2)},
    s : function(date){return date.getSeconds()},
    m : function(date){return date.getMinutes()},
    h : function(date){return date.getHours()},
  }
  if(!time && !mode){
    return defaultModes['ts'](date);
  }else if(defaultModes[mode] !== undefined){
    return defaultModes[mode](date);
  }else{
    let text ='';
    for (let i = 0; i < mode.length; i++) {
      let letter = mode.charAt(i);
      if(zero){
        text += replacement[letter] !== undefined ? util.number.zerofication(replacement[letter](date)) : letter
      }else{
        text += replacement[letter] !== undefined ? replacement[letter](date) : letter
      }
    }
    return text
  }
}

// ************************************* TIME ***************************
util.time = {};

util.time.now = function(time){
  const date = typeof(time) === 'number' ? new Date(time) : new Date();
  return Math.round(date.getTime()/1000)
}

util.time.convert = function(time,mode){
  mode = mode || 's-ms';
  const sg_ms = 1000;
  const m_sg = 60;
  if(mode == 's-ms'){time *= sg_ms}
  else if(mode == 'm-ms'){time *= sg_ms*m_sg}
  else if(mode == 'm-s'){time *= m_sg}
  else if(mode == 's-date'){time = util.date('hms/DMY',time*sg_ms)}
  else if(mode =="s-hhmmss"){
    const hours = Math.floor(time / 3600);
    time %= 3600;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    time = `${util.number.zerofication(hours)}:${util.number.zerofication(minutes)}:${util.number.zerofication(seconds)}`
  }
  //console.log(time);
  return time
}

util.time.Timeout = class{
  constructor(fn,delay){
    this.timer = setTimeout(function(){this.running = false;fn()},delay);
    this.running = true;
  }
  remove(){clearTimeout(this.timer);this.running = false}
  get pending(){return this.running}
  // del(){delete this}
}

util.time.fromString = function(content,mode){
  let result = false;
  if(mode === 'hh:mm!24'){
    const match = content.match(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])/)
    if(match){result = {hour : match[1], minute : match[2]}}
  }else if(mode === 'hh:mm!24!all'){
    const match = content.match(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])/g)
    if(match){result = match}
  }else if(mode === 'DD/-MM'){
    const match = content.match(/(0?[1-9]|[12][0-9]|3[01])[\/\-](1[0-2]|0?[1-9])/)
    if(match){result = {day : match[1], month : match[2]}}
  }
  return result
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

util.string.concat = function(concat,...strings){
  return strings.join(concat)
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

util.color.random = function(converted){
    const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    if(converted === 'int'){return util.color.convert(randomColor,'hex-int')}
    return randomColor
}

util.color.myRandom = function(converted){
  const color = myColors[Math.floor(Math.random()*Object.keys(myColors).length)]
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
      if(i.startsWith('_')){commands[i] = load[i];continue}; // it allows raw _categories in cmds.json
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
        try{
          resolve(JSON.parse(chunks));
        }catch(err){
          console.log(err);
          reject(`Error request to "${url}"\n${err}`)
        }
        // resolve(JSON.parse(chunks));
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

util.msg.sendImage_ = function(urls,results,container,callback){
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

util.msg.sendImage = function(url){
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

util.msg.Courier = function(courier){
    this.courier = courier;
    this.templates = {};
    this.send = function(template,message,args){
      if(this.templates[template]){
        this.templates[template].do(message,args)
      }
    }
    this.defineTemplate = function(name,template,fn){
      this.templates[name] = {
        do : (message,args) => {
          // console.log(this);
          fn(this.message(template,message),args)
        },
        template : template,
        fn : fn
      }
    }
    this.message = function(templateObj,options){
      const courier = this.courier;
      let template = Object.assign({},templateObj);
      for (var field in template) {
        if(typeof template[field] === 'string'){
          const matches = template[field].match(/<[^>]+>/g);
          if(matches){
            matches.forEach(match => {template[field] = template[field].replace(match,eval(match.slice(1,-1)))})
          }
        }else if(typeof template[field] === 'object'){
          template[field] = this.message(template[field],options);
        }
      }
      return template
    }
    this.getTemplate = function(templateName,options){
      if(this.templates[templateName]){
        return this.message(this.templates[templateName].template,options);
      }
    }
}

util.msg.Notifier = class{
    constructor(logchannel,options,last){
      const last_default = 6;
      const last_limit = 10;
      this.inbox = [];
      this.last = typeof(last) === 'number' && last < last_limit && last > 0 ? last : last_default;
      this.channel = logchannel;
      this.options = {title : options.title || 'Notificationer', color : options.color || 0};
      this.events = options.events || {memberout : "📤", memberin : "📥", bot : "🤖"}
      this.debugger = new util.u.Logger(options.name || '',3,[{name : 'custom', level : 1, color : 'red'}])
      for (var event in this.events) {
        this.debugger.register(event.toUpperCase(),0,options.loggerColor || 'magenta')
      }

    }
    add(type,content,log){
      this.inbox.push({type,content,date : util.date()});
      this.debugger.log(type,content);
      if(log){this.log(type,content)}
    }
    log(type,content){
      this.channel.createMessage(`${this.events[type] || type} ${content}`);
    }
    getLast(){
      return this.inbox.slice(-this.last);
    }
    overview(msg){
      // let table = new util.table.new(['Type','Date','Notification'],['4','11r','20']);
      const notifications = this.getLast();
      if(notifications.length < 1){return};
      msg.author.getDMChannel().then(channel => channel.createMessage({embed : {
        title : this.options.title,
        description : notifications.map(notification => `${util.dateCustom(notification.date*1000,'h:m:s D/M',true)} ${this.events[notification.type] || notification.type} - ${notification.content}`).reverse().join('\n'),
        color: this.options.color
      }}))
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

util.type = {};

util.type.Collection = (function(obj){
  const objwithID = function(id,obj){
    let result = Object.assign({},obj);
    result._id = id;
    return result
  }
  return class extends Map{
    constructor(obj){
      let list;
      if(typeof obj ===  'object' && !Array.isArray(obj)){
        list = Object.keys(obj).map(el => [el,objwithID(el,obj[el])])
      }else if(Array.isArray(obj)){
        list = obj.map(el => [el[0],objwithID(el[0],el[1])])
      }
      super(list);
    }
    add(id,obj){
      this.set(id, objwithID(id,obj));
      return obj
    }
    remove(id){
      let item = this.get(id);
      if(!item){
        return null
      }
      this.delete(id)
      return item
    }

    update(id,obj){
      return this.add(id,obj);
    }

    find(func){
      for(let item of this.values()) {
        if(func(item)){
          return item;
        }
      }
      return undefined;
    }

    filter(func) {
      let arr = [];
      for(let item of this.values()) {
          if(func(item)) {
              arr.push(item);
          }
      }
      return arr;
    }
    map(func) {
        let arr = [];
        for(let item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }
    sort(func){
      return this.map(item => item).sort(func)
    }
    each(func){
      for(let item of this.values()) {
        const result = func(item);
        if(result){this.update(item._id,result)}
      }
    }
    mutate(id,func){
      let item = this.find(el => el._id === id);
      if(item){
        const result = func(item);
        if(result){this.update(item._id,result)}
      }else{return false}
    }
    getall(){return this.map(item => item)}
    get log(){
      console.log(this);
      // console.log(this.values());
    }
  }
})()

// *************************** U (UTIL) MODULE **********************
util.u = {};

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

util.u.chalk = function(color,text){
  color = color || 'white'
  const colors = {
    black : "\x1b[30m",
    red : "\x1b[31m",
    green : "\x1b[32m",
    yellow : "\x1b[33m",
    blue : "\x1b[34m",
    magenta : "\x1b[35m",
    cyan : "\x1b[36m",
    white : "\x1b[37m",

    error : "\x1b[41m\x1b[37m",
    warning : "\x1b[43m\x1b[30m"
    // FgBlack = "\x1b[30m"
    // FgRed = "\x1b[31m"
    // FgGreen = "\x1b[32m"
    // FgYellow = "\x1b[33m"
    // FgBlue = "\x1b[34m"
    // FgMagenta = "\x1b[35m"
    // FgCyan = "\x1b[36m"
    // FgWhite = "\x1b[37m"
    //
    // BgBlack = "\x1b[40m"
    // BgRed = "\x1b[41m"
    // BgGreen = "\x1b[42m"
    // BgYellow = "\x1b[43m"
    // BgBlue = "\x1b[44m"
    // BgMagenta = "\x1b[45m"
    // BgCyan = "\x1b[46m"
    // BgWhite = "\x1b[47m"
  }
  const reset = "\x1b[0m";

  return colors[color] ? colors[color] + text + reset : text
}

util.u.Logger = class{
  constructor(name,level,customLogs){
    this.name = name || ''
    this.level = level || 4
    this.customLogs = {}
    this.logs = {
      info : {name : 'INFO', level : 0, color : 'cyan'},
      warn : {name : 'WARN', level : 1, color : 'yellow'},
      error : {name : 'ERROR', level : 2, color : 'red'}
    }
    this.register = function(mode,level,color,safe){
      if(mode){
        if(safe && this.logs[mode.toLowerCase()]){return};
        this.logs[mode.toLowerCase()] = {name : mode, level : level || 0, color : color || 'white'}
      }
    }
    if(customLogs){
      customLogs.forEach(log => {
        if(log.name){
          this.register(log.name,log.level,log.color,true);
        }else{
          this.register(log,0,'white',true);
        }
      })
    }
  }
  log(mode,text){
    if(this.logs[mode] && this.logs[mode].level <= this.level){
      console.log(`${util.u.chalk(this.logs[mode].color,this.logs[mode].name)}${this.name ? ':' + this.name : ''} <${util.dateCustom(null,'h:m:s D/M/Y',true)}>> ${text}`);
    }
  }
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

// *************************** OS (Operating System) MODULE **********************
util.os = {};
util.os.bytesConvert = function(bytes,mode){
  if(mode === 'MB'){
    return Math.round(bytes / (1024*1024))
  }
}

util.os.getCPUInfo = function(callback){
    var cpus = os.cpus();
    var user = 0;
    var nice = 0;
    var sys = 0;
    var idle = 0;
    var irq = 0;
    var total = 0;

    for(var cpu in cpus){
        if (!cpus.hasOwnProperty(cpu)) continue;
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }

    var total = user + nice + sys + idle + irq;

    return {
        'idle': idle,
        'total': total
    };
}

util.os.getCPUUsage = function(callback, free){

    var stats1 = util.os.getCPUInfo();
    var startIdle = stats1.idle;
    var startTotal = stats1.total;

    setTimeout(function() {
        var stats2 = util.os.getCPUInfo();
        var endIdle = stats2.idle;
        var endTotal = stats2.total;

        var idle 	= endIdle - startIdle;
        var total 	= endTotal - startTotal;
        var perc	= idle / total;

        if(free === true)
            callback( perc );
        else
            callback( (1 - perc) );

    }, 1000 );
}

// *************************** HELPER MODULE **********************
util.helper = {};

util.helper.Logger = class extends util.u.Logger{
    // Create a Logger for Discord and console
    constructor(logchannel,options,lastMessages){
      //@logchannel : Eris.Channel class
      //@options : {
      //    name : string - It shows in console
      //    title : string - Title for message sending to Discord with .overview method
      //    events : dictionary - Name of event : emoji
      //    resetEvents : boolean - Reset default event form util.u.logger
      //    messageNologs : string - Message to send when there aren't logs in inbox_tray
      //    color : number (integer)
      //    loggerColor : string (see util.u.chalk)
      // }
      // lastMessages : number (integer) - It shows last "lastMessages" messages
      const name = options.name || '';
      super(name,4)
      const last_default = 6;
      const last_limit = 10;
      this.inbox = [];
      this.lastMessages = typeof(last) === 'number' && lastMessages < last_limit && lastMessages > 0 ? lastMessages : last_default;
      this.channel = logchannel;
      this.options = {name : name, title : `${name} - ${options.title || 'Logger'}`, color : options.color || 0, nologs : options.nologs || 'No logs yet!'};
      this.events = options.events || {memberout : {icon : "📤", color : 'magenta'},
        memberin : {icon : "📥", color : 'magenta'},
        bot : {icon : "🤖", color : 'magenta'}}
      if(options.resetEvents){this.logs = {}};
      // this.debugger = new util.u.Logger(options.name || '',3,[{name : 'custom', level : 1, color : 'red'}])
      for (var event in this.events) {
        console.log(event,this.events[event].color);
        this.register(event.toUpperCase(),0,this.events[event].color || 'magenta')
      }

    }
    add(type,content,log){
      this.inbox.push({type,content,date : util.dateCustom(null,'h:m:s D/M',true)});
      this.log(type,content);
      if(log){this.send(type,content)}
    }
    send(type,content){
      this.channel.createMessage(`${this.events[type].icon || type} ${content}`);
    }
    getLast(){
      return this.inbox.slice(-this.lastMessages);
    }
    overview(msg){
      const notifications = this.getLast();
      if(notifications.length < 1){return msg.reply(this.options.nologs)};
      msg.author.getDMChannel().then(channel => channel.createMessage({embed : {
        title : this.options.title,
        description : notifications.map(notification => `${notification.date} ${this.events[notification.type] || notification.type} - ${notification.content}`).reverse().join('\n'),
        color: this.options.color
      }}))
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
        if(category[cmd].s[array_subcommands[scmd]].hide){continue};
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

util.fn.helpGeneralCategories = function(msg,categories,prefix,title,help,dm,replace){
  console.log(replace);
  const text = title + '\n' + help + '\n\n' + Object.keys(categories).sort().map(category_name => {
    const category = categories[category_name];
    category.name = category_name;
    console.log(category);
    // console.log(replace);
    if(category.hide || category.owner){return};
    category.description = replace ? replace.do(category.description) : category.description;
    return `**${category.name}**: ${category.description}\n\`${prefix}help ${category_name.toLowerCase()}\``
  }).filter(c => c).join('\n\n');
  if(dm && msg.channel.type === 0){
    util.msg.createDM(msg,text);
  }else{
    util.msg.create(msg,text);
  }
}

util.fn.helpGetCmdsFromCategories = function(msg,prefix,commands,categories,title,help,dm,replace){
  console.log('TYPEOF',typeof categories,categories);
  let organize = typeof categories === 'string' ? [categories.toLowerCase()] : categories.map(cat => cat.toLowerCase()).sort();
  const cmds = Object.keys(commands).filter(c => !c.startsWith('_')).map(c => {
    const cmd = commands[c];
    return cmd
  }).filter(c => organize.indexOf(c.category.toLowerCase()) > -1);
  if(cmds.length < 1){return};
  console.log(cmds);
  function sortCmdsFromCat(a,b){
    a = a.cmd.toLowerCase();b = b.cmd.toLowerCase();
    if(a > b){return 1}else if(a < b){return -1}else{return 0}
  }
  function showSubcommands(cmd){
    if(!cmd.s){
      return '';
    }else{
      const scmds = Object.keys(cmd.s).map(sc => {
        const scmd = cmd.s[sc];
        if(scmd.hide){return};
        return `    · \`${scmd.cmd}${scmd.arguments ? ' ' + scmd.arguments : ''}\` - ${replace ? replace.do(scmd.description) : scmd.description}`
      }).filter(scmd => scmd)
      console.log(scmds);
      if(scmds.length < 1){return ''};
      return '\n' + scmds.join('\n')
    }
  }
  const text = util.string.concat('\n\n',title,help,organize.map(cat => {
    return `**${util.string.capitalize(cat)}**\n\n${cmds.filter(c => {console.log(c.cmd,c.category);return cat === c.category.toLowerCase() && !c.hide}).sort(sortCmdsFromCat).map(c => `\`${prefix}${c.cmd}${c.arguments ? ' ' + c.arguments : ''}\` - ${replace ? replace.do(c.description) : c.description}${showSubcommands(c)}`).join('\n')}`
  }).join('\n\n'))
  if(dm && msg.channel.type === 0){
    util.msg.createDM(msg,text);
  }else{
    util.msg.create(msg,text);
  }
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

util.cmd.create = function(cmd,options,fn){
  if(Array.isArray(cmd)){
  }else{
    this.command = cmd
  }
  this.description = options.description || '';
  this.onlyOwner = options.onlyOwner || false;
  this.onlyGuild = options.onlyGuild || false;
  this.fn = fn
  this.subcommands = []
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
