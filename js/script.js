//canvas init
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//canvas dimensions
var W = 1920;
var H = 1080;
//var W = window.innerWidth;
//var H = window.innerHeight;

function start() {
  document.getElementById("fileElement").addEventListener("change", function(e) {
    var file = this.files ? this.files[0] : {
        name: this.value
      },
      fileReader = window.FileReader ? new FileReader() : null;

    if (file) {
      if (fileReader) {
        fileReader.addEventListener("loadend", function(e) {
          processJSON(JSON.parse(e.target.result));
        }, false);
        fileReader.readAsText(file);
      } else {
        alert("This browser isn't smart enough!");
      }
    }
  }, false);

}

function processJSON(json) {
  if (json) {
    init(json.settings)
    draw(json.circles);
  }
}

function init(settings) {
  W = settings.xResolution;
  H = settings.yResolution;
  canvas.width = W;
  canvas.height = H;
}

function draw(circles) {
  ctx.clearRect(0, 0, W, H);
  for (var circleIndex = 0; circleIndex < circles.length; circleIndex++) {
    var segmCount = circles[circleIndex].segmCount;
    var segmRepeats = circles[circleIndex].segmRepeats;
    var colors = circles[circleIndex].colors;
    var rad1 = circles[circleIndex].rad1;
    var rad2 = circles[circleIndex].rad2;
    var xCentre = circles[circleIndex].xCentre;
    var yCentre = circles[circleIndex].yCentre;

    var angleStep = Math.PI * 2 / (segmCount * segmRepeats);
    var angleOffset = 0;
    for (var j = 0; j < segmRepeats; j++) {
      angleOffset += angleStep;
      drawFigure(segmCount, segmRepeats, getColor(colors, j), rad1, rad2, xCentre, yCentre, angleOffset);
    }
  }
}

function getColor(colors, index) {
  var color = colors[index % colors.length];
  if (color.startsWith("md_colors."))
    return md_colors.get(color.substring(10));
  else
    return color;
}

function drawFigure(segmCount, segmRepeats, color, rad1, rad2, xCentre, yCentre, angleOffset) {
  var xCent = xCentre * W;
  var yCent = yCentre * H;
  for (var i = 0; i < segmCount; i++) {
    var a = i * Math.PI * 2 / (segmCount) + angleOffset;
    var a2 = a + Math.PI * 2 / (segmCount * segmRepeats);
    var x1 = xCent + rad1 * Math.cos(a);
    var y1 = yCent + rad1 * Math.sin(a);
    var x2 = xCent + rad2 * Math.cos(a2);
    var y2 = yCent + rad2 * Math.sin(a2);

    drawPolygon(color, xCent, yCent, x1, y1, x2, y2);
  }
}

function drawPolygon(color, x1, y1, x2, y2, x3, y3) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

start();