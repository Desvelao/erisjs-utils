const https = require('https')
const http = require('http')

module.exports.getJSON = function(url){
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    // console.log(url);
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error(`Failed to load page, status code: ${response.statusCode}\nURL: ${url}`));
       }
      //  console.log('Test');
      // temporary data holder
      var chunks = '';
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {chunks += chunk});
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        // console.log('end');
        // console.log(chunks);
        try{
          resolve(JSON.parse(chunks));
        }catch(err){
          console.log(err);
          reject(`Error request to "${url}"\n${err}`)
        }
        // resolve(JSON.parse(chunks));
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    request.end();
    })
}

module.exports.getJSONMulti = function(urls,results){
  // var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  // console.log(results);
  var promises = [];
  for (var i = 0; i < urls.length; i++) {
    promises.push(module.exports.getJSON(urls[i]))
  }
  return Promise.all(promises)
}

module.exports.multipleJSON = function(urls,responses,ratelimit,callback){
    responses = responses || []
    // console.log(responses);
    const url = urls.shift()
    module.exports.getJSON(url).then(data => {
      responses.push(data)
      console.log('Done request:',url);
      if(!urls.length){return callback(responses)}
      setTimeout(() => {
        module.exports.multipleJSON(urls,responses,ratelimit,callback)
      },Math.round(1000/ratelimit))
    })
}

module.exports.getJSON2 = function(urls,results){
  var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  // console.log(results);
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    // console.log(url);
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      //  console.log('Test');
      // temporary data holder
      var chunks = '';
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {chunks += chunk});
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        // console.log('end');
        results.push(JSON.parse(chunks));
        // console.log(urls);
        if(urls.length){
          // console.log(urls,results);
          setTimeout(function(){module.exports.getJSON(urls,results)},200);
        }else{
          // console.log(results);
          resolve(results);
        }
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    request.end();
    })
}

module.exports.post = function (options,reqBody){
  //options = {host,path} , reqBody =
  //reqBody = '{"value1" : "E1", "value2" : "T", "value3" : "Z"}'
  options.headers = {'content-type' : 'application/json','content-length':reqBody.length};
      //host : "maker.ifttt.com", //--https://maker.ifttt.com/
  options.method = 'POST';
  options.body = reqBody;
      //port = 443,
      //body = { value1 = "E1", value2 = "T", value3 = "Z" },
      //path : "/trigger/eventmaker/with/key/WHVo4sC6HaYu3jQhickOj"
  const req = https.request(options, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.write(options.body);
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
}

module.exports.postIFTTT = function(){ //EXPERIMENTAL
  const reqBody = '{"value1" : "E1", "value2" : "T", "value3" : "Z"}'
  const options = {
      host : "maker.ifttt.com", //--https://maker.ifttt.com/
      headers : {'content-type' : 'application/json','content-length':reqBody.length},

      //--headers = {{'content-type' , 'application/json'},
      method : 'POST',
      //port = 443,
      body : reqBody,
      //body = { value1 = "E1", value2 = "T", value3 = "Z" },
      path : "/trigger/eventmaker/with/key/WHVo4sC6HaYu3jQhickOj"
    };
  //console.log(url,results);
  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  console.log(options.body);
  req.write(options.body);
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
}
