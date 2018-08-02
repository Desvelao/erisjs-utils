const Datee = require('./date')
module.exports.backupDBfile = function(db,bot,channel,backup){
  return new Promise((resolve, reject) => {
    db.once('value').then((snap) => {
      if(!snap.exists()){return};
      snap = snap.val();
      let buff = new Buffer(JSON.stringify(snap));
      let filename = `${backup.filenameprefix}${Datee.custom(null,'D/M/Y h:m:s')}.json`.replace(/ /g,"_");
      bot.createMessage(channel,{content : `${backup.messageprefix} \`${Datee.custom(null,'D/M/Y h:m:s')}\``},{file : buff, name : filename}).then(message => resolve(message)).catch((error) => reject(error))
      resolve(snap)
    })
  })
}
