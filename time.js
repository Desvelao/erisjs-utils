const Number = require('./number.js')
const Datee = require('./date.js')

module.exports.convert = function(time,mode){
  mode = mode || 's-ms';
  const sg_ms = 1000;
  const m_sg = 60;
  if(mode == 's-ms'){time *= sg_ms}
  else if(mode == 'm-ms'){time *= sg_ms*m_sg}
  else if(mode == 'm-s'){time *= m_sg}
  else if(mode == 's-date'){time = Datee.custom(time*sg_ms,'h:m:s D/M/Y')}
  else if(mode =="s-hhmmss"){
    const hours = Math.floor(time / 3600);
    time %= 3600;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    time = `${Number.zerofication(hours)}:${Number.zerofication(minutes)}:${Number.zerofication(seconds)}`
  }
  //console.log(time);
  return time
}

module.exports.fromString = function(content,mode){
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
