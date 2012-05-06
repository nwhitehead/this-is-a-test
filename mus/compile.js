var endTime = function (time, expr) {
    if (expr.tag === 'note') return time + expr.dur;
    if (expr.tag === 'seq')
        return endTime(endTime(time, expr.left), expr.right);
    return Math.max(endTime(time, expr.left), endTime(time, expr.right));
};

var compileT = function (musexpr, time) {
    if (musexpr.tag === 'note') {
        return [ { tag: 'note', 
                  pitch: musexpr.pitch,
                  start: time,
                  dur: musexpr.dur } ];
    }
    if (musexpr.tag === 'seq') {
        var left = compileT(musexpr.left, time);
        var ldur = endTime(time, musexpr.left);
        var right = compileT(musexpr.right, ldur);
        return left.concat(right);
    }
    if (musexpr.tag === 'par') {
        var left = compileT(musexpr.left, time);
        var right = compileT(musexpr.right, time);
        return left.concat(right);
    }
};

var compile = function (musexpr) {
    return compileT(musexpr, 0);
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
