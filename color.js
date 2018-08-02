const Color = {}
/**
 * Convert format colors
 * @param  {string/number} color [input value]
 * @param  {string} mode  [format to convert value]
 * @return {string/number}       [description]
 */
Color.convert = function(color,mode){
  mode = mode || 'hex-int';
  if(mode === 'hex-int'){color = parseInt(color.replace(/^#/, ''), 16)}
  return color
}

/**
 * Get a color from a internal list
 * @param  {string} color     [color to get]
 * @param  {boolean} converted [convert to int]
 * @return {string}           [color]
 */
Color.get = function(color,converted){
  const myColor = myColors[color] || myColors['black']
  if(converted){
    return Color.convert(myColors[color],'hex-int')
  }
  return myColor
}
/**
 * Get a random color
 * @param  {boolean} converted [convert to int]
 * @return {string}           [color]
 */
Color.random = function(converted){
    const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    if(converted === 'int'){return Color.convert(randomColor,'hex-int')}
    return randomColor
}

/**
 * Get a random color for a internal list
 * @param  {boolean} converted [description]
 * @return {color}           [description]
 */
Color.myRandom = function(converted){
  const color = myColors[Math.floor(Math.random()*Object.keys(myColors).length)]
  if(converted){return Color.convert(color)}else{return color}
}

const myColors = {
  red : '#FF0000', green : '#00FF00', blue : '#0000FF', white : '#FFFFFF', black : '#000000'
}

module.exports = Color
