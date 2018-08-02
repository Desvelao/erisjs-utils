const Number = require('./number.js')

module.exports.custom = function(time,mode,zero){
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
        text += replacement[letter] !== undefined ? Number.zerofication(replacement[letter](date)) : letter
      }else{
        text += replacement[letter] !== undefined ? replacement[letter](date) : letter
      }
    }
    return text
  }
}

module.exports.now = () => Math.round(new Date().getTime()/1000)
