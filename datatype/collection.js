module.exports = (function(obj){
  const objwithID = function(id,obj){
    let result = Object.assign({},obj);
    result._id = id;
    return result
  }
  return class extends Map{
    constructor(obj){
      let list;
      if(typeof obj ===  'object' && !Array.isArray(obj)){
        list = Object.keys(obj).map(el => [el,objwithID(el,obj[el])])
      }else if(Array.isArray(obj)){
        list = obj.map(el => [el[0],objwithID(el[0],el[1])])
      }
      super(list);
    }
    add(id,obj){
      this.set(id, objwithID(id,obj));
      return obj
    }
    remove(id){
      let item = this.get(id);
      if(!item){
        return null
      }
      this.delete(id)
      return item
    }

    update(id,obj){
      return this.add(id,obj);
    }

    find(func){
      for(let item of this.values()) {
        if(func(item)){
          return item;
        }
      }
      return undefined;
    }

    filter(func) {
      let arr = [];
      for(let item of this.values()) {
          if(func(item)) {
              arr.push(item);
          }
      }
      return arr;
    }
    map(func) {
        let arr = [];
        for(let item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }
    sort(func){
      return this.map(item => item).sort(func)
    }
    each(func){
      for(let item of this.values()) {
        const result = func(item);
        if(result){this.update(item._id,result)}
      }
    }
    mutate(id,func){
      let item = this.find(el => el._id === id);
      if(item){
        const result = func(item);
        if(result){this.update(item._id,result)}
      }else{return false}
    }
    getall(){return this.map(item => item)}
    get log(){
      console.log(this);
      // console.log(this.values());
    }
  }
})()
