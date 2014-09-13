module.exports = function (delay, fromId) {
    var microDelay = 15;
    var id = 0;
    if (fromId) { loupe.skipDelays = true; }
    var nMicroDelays = delay / microDelay;

    return function () {
        id++;
        var microId = 0;
        var start, target;
        var countdown = Math.floor(nMicroDelays);

        //var wasSkipping = loupe.skipDelays;
        //var startedAt = new Date().getTime();
        while (countdown--) {
            weevil.send('delay', id + microId);
            loupe.triggerDelay(id + microId);

            if (!fromId || (id + microId) > fromId) { 
                loupe.skipDelays = false;

                start = new Date().getTime();
                target = start + microDelay;
                while (new Date().getTime() < target) {
                    //no-op
                }
            }

            microId += 0.000001;
        }
        //var actual = new Date().getTime() - startedAt;
        //if (loupe.skipDelays) {
        //    console.log(['Skipped', id, 'in', actual]);
        //} else {
        //    if (wasSkipping) {
        //        console.log([id, 'Partial!', delay, 'actual', actual, 'error', actual - delay]);
        //    } else {
        //        console.log([id, 'Target', delay, 'actual', actual, 'error', actual - delay]);
        //    }
        //}
    };
};
