module.exports = class DiscordTable{
  constructor(header,data,distribution,options){
    this.header = header
    this.data = data || []
    this.distribution = distribution
    options = options || {}
    this.fill = options.fill || ' '
  }
  render(){
    return DiscordTable.render(this.header,this.data,this.distribution,this.fill)
  }
  addRow(row){
    this.data.push(row)
  }
  static render(header,data,distribution,fill,separator){
    const table = [header].concat(data)
    // console.log(table);
    return table.map(row => DiscordTable.renderRow(row,distribution,fill,separator)).join('\n')
  }
  static get blank(){return ' '}
  static renderRow(data,distribution,fill,separator){
    fill = fill || ' '
    separator = separator || ' '
    let rendered = data.map((item,index) => {
      if([null,undefined].includes(item)){item = '................'}
      item = item.toString()
      const distri = DiscordTable.getDistribution(distribution[index])
      let text = ''
      if(item.length < distri.space){
        // const dif = distri.space - item.length
        let dif = distri.space - item.length
        if(distri.align === 'l'){
          text = item
          if(dif - 1 > 0 ){text += DiscordTable.blank; dif--}
          text += fill.repeat(dif)
        }else if(distri.align === 'r'){
          if(dif - 1 > 0 ){text += DiscordTable.blank; dif--}
          text += fill.repeat(dif) + item
        }else if(distri.align === 'c'){
          const rest = dif%2
          const spaceside = Math.trunc(dif/2)
          if(dif - 1 > 0 ){text = fill.repeat(spaceside + rest - 1) + DiscordTable.blank + item + DiscordTable.blank + fill.repeat(spaceside - 1)}
          else{text = fill.repeat(dif) + item}
        }
        // console.log(item,'item<distri.space',text);
      }else{
        // const dif = distri.space - item.length
        text = item.slice(0,distri.space)
        // console.log(item,'item>distri.space',text);
      }
      return text
    }).join(' ')
    return '`' + rendered + '`'
  }
  static getDistribution(distribution){
    return {
      space : parseInt(distribution.match(new RegExp('(\\d*)'))[1]),
      align : distribution.match(new RegExp('(l|r|c)')) ? distribution.match(new RegExp('(l|r|c)'))[1] : 'l',
      filled : 'redone'
    }
  }
}
