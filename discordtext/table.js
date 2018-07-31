class DiscordTable{
  constructor(header,data,distribution,options){
    this.header = header
    this.data = data || []
    this.distribution = distribution
    this.fill = options.fill || ' '
  }
  render(){
    return Table.render(this.header,this.data,this.distribution,this.fill)
  }
  addRow(row){
    this.data.push(row)
  }
  static render(header,data,distribution,fill,separator){
    const table = header.concat(data)
    return table.map(row => Table.renderRow(row,distribution,fill,separator)).join('\n')
  }
  static get blank(){return ' '}
  static renderRow(data,distribution,fill,separator){
    fill = fill || ' '
    separator = separator || ' '
    let rendered = data.map((item,index) => {
      if([null,undefined].includes(item)){item = '................'}
      item = item.toString()
      const distri = getDistribution(distribution[index])
      let text = ''
      if(item.length < distri.space){
        // const dif = distri.space - item.length
        let dif = distr.space - item.length
        if(distri.align === 'l'){
          text = item
          if(dif - 1 > 0 ){text += Table.blank; dif--}
          text += fill.repeat(dif)
        }else if(distri.align === 'r'){
          if(dif - 1 > 0 ){text += Table.blank; dif--}
          text += fill.repeat(dif) + item
        }else if(distri.align === 'c'){
          const rest = dif%2
          const spaceside = Math.truc(dif/2)
          if(dif - 1 > 0 ){text = fill.repeat(spaceside + rest - 1) + Table.blank + item + Table.blank + fill.repeat(spaceside - 1)}
          else{text = fill.repeat(dif) + item}
        }
      }else if(item.length > distri.space){
        // const dif = distri.space - item.length
        text = item.slice(0,distri.space)
      }
      return text
    }).join('')
    return '`' + rendered + '`'
  }
  static getDistribution(distribution){
    return {
      space : distribution.match(new RegExp('(\\d*)'))[1],
      align : spaces[i].match(new RegExp('(l|r|c)')) ? spaces[i].match(new RegExp('(l|r|c)'))[1] : 'l',
      filled : 'redone'
    }
  }
}

module.exports = DiscordTable
