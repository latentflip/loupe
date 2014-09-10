var goldenRatio = 0.618033988749895;

module.exports = {
    createSequence: function () {
        var hue = 0;
        var saturation = '99%';
        var lightness = '40%';

        return {
            next: function () {
                hue = ((hue + goldenRatio) % 1) * 360;
                return 'hsla(' + [hue, saturation, lightness, 0.15].join(',') + ')';
            }
        };
    }
};
