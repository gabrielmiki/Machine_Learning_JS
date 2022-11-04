var THRESHOLD = 155;
var OBJECT_PROP = null;
var DIMENSIONS = 2;

CANVAS = document.getElementById('camera');
CANVAS.width = SIZE;
CANVAS.height = SIZE;

function processMatrix(matrix) {
    isolateObject(matrix);
    var box = getBoundingBox(matrix);
    var boxProp = getBoxProprieties(box);
    var blackPixels = countBlackPixels(matrix);
    var boxArea = boxProp.width * boxProp.length;
    var fullness = blackPixels / boxArea;

    OBJECT_PROP = [];
    OBJECT_PROP[1] = boxProp.aspectRatio;
    OBJECT_PROP[2] = fullness;

    recognize(OBJECT_PROP);
    updateCanvas(matrix);
    drawBox(box);
}

function countBlackPixels(matrix) {
    var count = 0;
    for (var i = 1; i <= SIZE; i++) {
        for (var j = 1; j <= SIZE; j++) {
            if (matrix[i][j] == 0) {
                count++;
            }
        }
    }
    return count;
}

function recognize(currentObject) {
    var name;
    if (OBS_COUNT == 0) {
        name = '?';
    }
    else {
        var neighbor = getNearestNeightbor(currentObject);
        name = neighbor.name;
    }
    document.getElementById("output").innerHTML = name;
}

function getNearestNeightbor(currentObject) {
    var neighbor = null;
    var minDist = null;
    for (var i = 1; i <= OBS_COUNT; i++) {
        var dist = distance(currentObject, OBSERVATIONS[i].prop);
        if (minDist == null || minDist > dist) {
            minDist = dist;
            neighbor = OBSERVATIONS[i];
        }
    }
    return neighbor;
}

function isolateObject(matrix) {
    for (var i = 0; i <= SIZE; i++) {
        for (var j = 0; j <= SIZE; j++) {
            if (matrix[i][j] < THRESHOLD) {
                matrix[i][j] = 0;
            }
            else {
                matrix[i][j] = 255;
            }
        }
    }
}

function getBoundingBox(matrix) {
    var bbox = {
        xMin: SIZE + 1,
        xMax: 0,
        yMin: SIZE + 1,
        yMax: 0
    };

    for (var y = 1; y <= SIZE; y++) {
        for (var x = 1; x <= SIZE; x++) {
            bbox.yMin = Math.min(y, bbox.yMin);
            bbox.yMax = Math.max(y, bbox.yMax);
            bbox.xMin = Math.min(x, bbox.xMin);
            bbox.xMax = Math.max(x, bbox.xMax);
        }
    }
    return bbox;
}

function drawBox(box) {
    var context = CANVAS.getContext('2d');
    context.beginPath();
    var deltaX = box.xMax - box.xMin;
    var deltaY = box.yMax - box.yMin;
    context.rect(box.xMin, box.yMin, deltaX, deltaY);
    context.stroke();
}

function getBoxProprieties(box) {
    var prop = {
        length: 0,
        width: 0,
        aspectRatio: 0
    };

    var deltaX = box.xMax - box.xMin + 1;
    var deltaY = box.yMax - box.yMin + 1;

    prop.length = Math.max(deltaX, deltaY)
    prop.width = Math.min(deltaX, deltaY);
    prop.aspectRatio = prop.width / prop.length;

    return prop;
}

function distance(p1, p2) {
    var dist = 0;
    for (var i = 1; i <= DIMENSIONS; i++) {
        dist += (p1[i] - p2[i]) * (p1[i] - p2[i]);
    }
    return Math.sqrt(dist);
}