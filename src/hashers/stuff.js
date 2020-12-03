const circles_ = {};

export const grayscale = function (pixels, width, height, fillRGBA) {
  var gray = new Uint8ClampedArray(fillRGBA ? pixels.length : pixels.length >> 2);
  var p = 0;
  var w = 0;
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
      gray[p++] = value;

      if (fillRGBA) {
        gray[p++] = value;
        gray[p++] = value;
        gray[p++] = pixels[w + 3];
      }

      w += 4;
    }
  }
  return gray;
};

const THRESHOLD = 100;

export const findCorners = function (pixels, width, height, opt_threshold) {
  var circleOffsets = getCircleOffsets_(width);
  var circlePixels = new Int32Array(16);
  var corners = [];

  if (opt_threshold === undefined) {
    opt_threshold = THRESHOLD;
  }

  // When looping through the image pixels, skips the first three lines from
  // the image boundaries to constrain the surrounding circle inside the image
  // area.
  for (var i = 3; i < height - 3; i++) {
    for (var j = 3; j < width - 3; j++) {
      var w = i * width + j;
      var p = pixels[w];

      // Loops the circle offsets to read the pixel value for the sixteen
      // surrounding pixels.
      for (var k = 0; k < 16; k++) {
        circlePixels[k] = pixels[w + circleOffsets[k]];
      }

      if (isCorner(p, circlePixels, opt_threshold)) {
        // The pixel p is classified as a corner, as optimization increment j
        // by the circle radius 3 to skip the neighbor pixels inside the
        // surrounding circle. This can be removed without compromising the
        // result.
        corners.push(j, i);
        j += 3;
      }
    }
  }

  return corners;
};

const getCircleOffsets_ = function (width) {
  var circle = new Int32Array(16);

  circle[0] = -width - width - width;
  circle[1] = circle[0] + 1;
  circle[2] = circle[1] + width + 1;
  circle[3] = circle[2] + width + 1;
  circle[4] = circle[3] + width;
  circle[5] = circle[4] + width;
  circle[6] = circle[5] + width - 1;
  circle[7] = circle[6] + width - 1;
  circle[8] = circle[7] - 1;
  circle[9] = circle[8] - 1;
  circle[10] = circle[9] - width - 1;
  circle[11] = circle[10] - width - 1;
  circle[12] = circle[11] - width;
  circle[13] = circle[12] - width;
  circle[14] = circle[13] - width + 1;
  circle[15] = circle[14] - width + 1;

  circles_[width] = circle;
  return circle;
};

const isCorner = function (p, circlePixels, threshold) {
  if (isTriviallyExcluded(circlePixels, p, threshold)) {
    return false;
  }

  for (var x = 0; x < 16; x++) {
    var darker = true;
    var brighter = true;

    for (var y = 0; y < 9; y++) {
      var circlePixel = circlePixels[(x + y) & 15];

      if (!isBrighter(p, circlePixel, threshold)) {
        brighter = false;
        if (darker === false) {
          break;
        }
      }

      if (!isDarker(p, circlePixel, threshold)) {
        darker = false;
        if (brighter === false) {
          break;
        }
      }
    }

    if (brighter || darker) {
      return true;
    }
  }

  return false;
};

const isTriviallyExcluded = function (circlePixels, p, threshold) {
  var count = 0;
  var circleBottom = circlePixels[8];
  var circleLeft = circlePixels[12];
  var circleRight = circlePixels[4];
  var circleTop = circlePixels[0];

  if (isBrighter(circleTop, p, threshold)) {
    count++;
  }
  if (isBrighter(circleRight, p, threshold)) {
    count++;
  }
  if (isBrighter(circleBottom, p, threshold)) {
    count++;
  }
  if (isBrighter(circleLeft, p, threshold)) {
    count++;
  }

  if (count < 3) {
    count = 0;
    if (isDarker(circleTop, p, threshold)) {
      count++;
    }
    if (isDarker(circleRight, p, threshold)) {
      count++;
    }
    if (isDarker(circleBottom, p, threshold)) {
      count++;
    }
    if (isDarker(circleLeft, p, threshold)) {
      count++;
    }
    if (count < 3) {
      return true;
    }
  }

  return false;
};

const isBrighter = function (circlePixel, p, threshold) {
  return circlePixel - p > threshold;
};

const isDarker = function (circlePixel, p, threshold) {
  return p - circlePixel > threshold;
};
