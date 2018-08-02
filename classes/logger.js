const { chalk } = require('../utilities.js')
const Datee = require('../date.js')

module.exports = class Logger{
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
      console.log(`${chalk(this.logs[mode].color,this.logs[mode].name)}${this.name ? ':' + this.name : ''} <${Datee.custom(null,'h:m:s D/M/Y',true)}>> ${text}`);
    }
  }
}
