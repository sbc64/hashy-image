import { ethers } from 'ethers';
import * as photon from "@silvia-odwyer/photon"

const SAMPLE_SIZE = 32;
function initSQRT(N: number) {
  const c = new Array(N);
  for (let i = 1; i < N; i++) {
    c[i] = 1;
  }
  c[0] = 1 / Math.sqrt(2.0);
  return c;
}

const SQRT = initSQRT(SAMPLE_SIZE);

function initCOS(N:number) {
  const cosines = new Array(N);
  for (let k = 0; k < N; k++) {
    cosines[k] = new Array(N);
    for (let n = 0; n < N; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * N)) * n * Math.PI);
    }
  }
  return cosines;
}

const COS = initCOS(SAMPLE_SIZE);

function applyDCT(f, size) {
  var N = size;

  var F = new Array(N);
  for (var u = 0; u < N; u++) {
    F[u] = new Array(N);
    for (var v = 0; v < N; v++) {
      var sum = 0;
      for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
          sum += COS[i][u] * COS[j][v] * f[i][j];
        }
      }
      sum *= (SQRT[u] * SQRT[v]) / 4;
      F[u][v] = sum;
    }
  }
  return F;
}

const LOW_SIZE = 12;

export default async function phash(image: string, low_size = LOW_SIZE): Promise<string> {

  let canvas = document.createElement('canvas');
  canvas.style.border = "1px solid";
  const ctx = canvas.getContext('2d');
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);
  let i = (new Image());
  i.onload = function() {
    ctx.drawImage(i,0,0); // Or at whatever offset you like
    console.log(canvas)
    console.log(ctx)
    let p = photon.open_image(canvas, ctx);
    /*
    photon.grayscale(photon_image);
    photon.resize(photon_image, SAMPLE_SIZE, SAMPLE_SIZE, 1)
    let data = photon_image.get_raw_pixels();
    */



    /*
  const data = await sharp(image)
    .greyscale()
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "fill" })
    .rotate()
    .raw()
    .toBuffer();
  */
  // copy signal
  const s = new Array(SAMPLE_SIZE);
  for (let x = 0; x < SAMPLE_SIZE; x++) {
    s[x] = new Array(SAMPLE_SIZE);
    for (let y = 0; y < SAMPLE_SIZE; y++) {
      s[x][y] = data[SAMPLE_SIZE * y + x];
    }
  }

  // apply 2D DCT II
  const dct = applyDCT(s, SAMPLE_SIZE);

  // get AVG on high frequencies
  let totalSum = 0;
  for (let x = 0; x < low_size; x++) {
    for (let y = 0; y < low_size; y++) {
      totalSum += dct[x + 1][y + 1];
    }
  }

  const avg = totalSum / (low_size * low_size);

  // compute hash
  let fingerprint = "";

  for (let x = 0; x < low_size; x++) {
    for (let y = 0; y < low_size; y++) {
      fingerprint += dct[x + 1][y + 1] > avg ? "1" : "0";
    }
  }

  return fingerprint;
  };
  i.src = image;
  return  "a";
};
