module.exports.zerofication = function(text,digits){
  digits = digits || 2;
  text = text.toString();
  if(digits > text.length){
    text = '0'.repeat(digits-text.length) + text
  }
  return text
}

/**
 * Convert a number to k
 * @param  {number} number [description]
 * @param  {number} format [description]
 * @param  {2} digits [decimals digits]
 * @return {string}        [description]
 */
module.exports.tok = function(number,format,digits){ //Deprecated
  digits = digits || 1
  format = format || 1000
  return (number/format).toFixed(digits)
}

/**
 * Create a random within min-max or 1-min if max is not provide
 * @param  {number} min [description]
 * @param  {[number]} max [description]
 * @return {number}     [description]
 */
module.exports.random = function(min,max){
  return max !== undefined ? Math.floor(Math.random()*(max - min) + min) : Math.floor((Math.random() * min) + 1);
}
