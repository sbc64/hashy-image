import { findCorners, grayscale } from './stuff';
import { ethers } from 'ethers';

export async function pHash(image: Blob): Promise<string> {
  function doFindFeatures() {
    const width = 400;
    const height = 400;

    var image = document.getElementsByClassName('uploadPicture')[0] as CanvasImageSource;
    var canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context?.drawImage(image, 0, 0, width, height);

    const imageData = context?.getImageData(0, 0, width, height);

    const gray = grayscale(imageData?.data, width, height);
    const corners = findCorners(gray, width, height);

    for (var i = 0; i < corners.length; i += 2) {
      // context.fillStyle = '#f00';
      context?.fillRect(corners[i], corners[i + 1], 3, 3);
    }

    const entropy =
      '0x' +
      corners
        .map((value) => ethers.utils.hexlify)
        .map((v: any) => v.slice(2))
        .join('');

    return ethers.utils.keccak256(entropy);
    // to here
  }

  return doFindFeatures();
}
