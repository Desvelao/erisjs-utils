module.exports.link = function(link,text,mode){
  if(mode === 'embed+link'){
    return `[${text}](${link}) \`${link}\``
  }if(mode === 'embed+text'){
    return `[${text}](${link}) \`${text}\``
  }else{
    return `[${text}](${link})`
  }
}

module.exports.Discord = function(content){
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
