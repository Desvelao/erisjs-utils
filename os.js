const os = require('os')

module.exports.bytesConvert = function(bytes,mode){
  if(mode === 'MB'){
    return Math.round(bytes / (1024*1024))
  }
}

module.exports.getCPUInfo = function(callback){
    var cpus = os.cpus();
    var user = 0;
    var nice = 0;
    var sys = 0;
    var idle = 0;
    var irq = 0;
    var total = 0;

    for(var cpu in cpus){
        if (!cpus.hasOwnProperty(cpu)) continue;
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }

    var total = user + nice + sys + idle + irq;

    return {
        'idle': idle,
        'total': total
    };
}

module.exports.getCPUUsage = function(callback, free){
    var stats1 = module.exports.getCPUInfo();
    var startIdle = stats1.idle;
    var startTotal = stats1.total;
    setTimeout(function() {
        var stats2 = module.exports.getCPUInfo();
        var endIdle = stats2.idle;
        var endTotal = stats2.total;

        var idle 	= endIdle - startIdle;
        var total 	= endTotal - startTotal;
        var perc	= idle / total;

        if(free === true)
            callback( perc );
        else
            callback( (1 - perc) );

    }, 1000 );
}
