//From: https://stackoverflow.com/questions/49986720/how-to-detect-internet-explorer-11-and-below-versions

export default function isIE(model) {
  const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
  const msie = ua.indexOf('MSIE '); // IE 10 or older
  const trident = ua.indexOf('Trident/'); //IE 11
  
  return (msie > 0 || trident > 0);
}
