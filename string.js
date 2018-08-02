module.exports.capitalize = function(string){
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports.replace = function(text,dict,arrow){
  //console.log(arguments.length);
  if(dict){
    for (var k in dict) {
      let replaceText = arrow ? '<' + k + '>' : k;
      text = text.replace(new RegExp(replaceText,'g'),dict[k])
    }
  }
  return text
}
