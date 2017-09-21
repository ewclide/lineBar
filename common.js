document.addEventListener("DOMContentLoaded", function() {
    var lineBar = new LineBar({
        line : $('#lineBar')[0],
        leftArm : $('#lineBar').find('.left_arm')[0],
        rightArm : $('#lineBar').find('.right_arm')[0],
        bar : $('#lineBar').find('.green')[0],
        minField : $('#minField')[0],
        maxField : $('#maxField')[0],
        maxValue : 50000,
        minValue : 0,
        step : 1000
    });

    lineBar.setValue({
        from: 10000,
        to: 30000
    });

});