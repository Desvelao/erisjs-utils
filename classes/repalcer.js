module.exports = class Replacer{
  constructor(dicts,arrow,lang){
    this.keywords = []
    dicts.forEach(dict => {
      Object.keys(dict).forEach(key => this.keywords.push(Replacer._keyword(Replacer.setArrow(key,arrow),dict[k])))
    })
    this.lang
  }
  addDict(dict,arrow,category){
    arrow = arrow || false
    Object.keys(dict).forEach(key => this.keywords.push(Replacer._keyword(Replacer.setArrow((category ? category + '_' : '') + key,arrow),dict[k])))
  }
  do(keyword,){

  }
  static createDict(dict,arrow){

  }
  static setArrow(name,arrow){
    let set = {l : '', r : ''}
    if(typeof arrow === 'string'){set.l = set.r = arrow}else{set.l = arrow[0] || arrow.l || ''; set.r = arrow[1] || arrow.r || ''}
    return set.l + name + set.r
  }
  static _keyword(key,value){
    return {key, value}
  }
  static replace(string,dict){
    return Object.keys(dict).reduce((sum,key) => sum.replace(new RegExp(dict[key]),'g'))
  }
}




 = function(array_dicts,setArrow,lang){
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
