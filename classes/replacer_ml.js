/**
 * Create a replacer multilanguage
 * @type {[type]}
 */
module.exports = class ReplacerMultiLanguage{
  /**
   * Create a replacer multilanguage
   * @param {object} languages languages. Ex: {es : {....}, en : {....}, ru : {....}}
   * @param {object} keywords  Ex: {icon : 'https://....jpg'}
   * @param {object} options   [description]
   * @param {object} options.defaultLang   set default language
   * @param {object} options.arrow   arrow for keywords
   * @param {object} options.category   category for keywords
   */
  constructor(languages,keywords,options){
    this.languages = languages
    options = options || {}
    this.arrow = ReplacerMultiLanguage.getArrow(options.arrow)
    this.defaultLang = options.defaultLang
    this.keywords = keywords ? ReplacerMultiLanguage.createKeywords(keywords,options.arrow,options.category) : []
  }
  addKeywords(keywords,arrow,category){
    this.keywords = this.keywords.concat(ReplacerMultiLanguage.createKeywords(keywords,arrow,category))
    return this
  }
  addLanguague(code,language){
    this.languages[code] = language
    return this
  }
  do(string,keywords,withArrow){
    const lang = this.defaultLang
    const toReplace = this.languages[lang] && this.languages[lang][string] ? this.languages[lang][string] : string
    return keywords ? ReplacerMultiLanguage.replace(toReplace,[...this.keywords,...ReplacerMultiLanguage.createKeywords(keywords,withArrow ? this.arrow : null,null)]) : ReplacerMultiLanguage.replace(toReplace,[...this.keywords])
  }
  t(lang,string,keywords){
    lang = lang || this.defaultLang
    const toReplace = this.languages[lang] && this.languages[lang][string] ? this.languages[lang][string] : string
    return ReplacerMultiLanguage.replace(toReplace,[...this.keywords,...(keywords ? ReplacerMultiLanguage.createKeywords(keywords,null,null) : null)])
  }
  static replace(string,search){
    return search.reduce((sum,keyword) => sum.replace(new RegExp(keyword.key,'g'),keyword.value),string)
  }
  static getArrow(arrow){
    let set = {l : '', r : ''}
    if(arrow){
      if(Array.isArray(arrow) && arrow[0]){set.l = arrow[0]}
      if(Array.isArray(arrow) && arrow[1]){set.r = arrow[1]}
      if(arrow.l && typeof arrow.l === 'string'){set.l = arrow.l}
      if(arrow.r && typeof arrow.r === 'string'){set.r = arrow.r}
    }
    return set
  }
  static _createKeyword(keyword,value,arrow,category){
    let set = ReplacerMultiLanguage.getArrow(arrow)
    return ({key : set.l + (category ? category + '_' : '') + keyword + set.r, value})
  }
  static createKeywords(keywords,arrow,category){
    return Object.keys(keywords).map(key => ReplacerMultiLanguage._createKeyword(key,keywords[key],arrow,category))
  }
}
