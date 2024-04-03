import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io('https://3.126.213.152:3000/');

socket.on('message', (message) => {
  var qrcode = new QRCode("qrcode", {
    width: 200,
    height: 200,
    border: "1px solid black",
    colorDark: "#0d6efd",
    colorLight: "#ffffff",
    useSVG: true
  });

  if (message === 'ok') {
    qrcode.clear();
    QRArea.innerHTML = ''
    qrResult.innerHTML = '<span style="color:#006400">წარმატებულია</span>'
    qrResult.style.visibility = 'visible'

  } else if (message === 'fail') {
    qrcode.clear();
    QRArea.innerHTML = ''
    qrResult.innerHTML = '<span style="color:red">წარუმატებელია</span>'
    qrResult.style.visibility = 'visible'

  } else {
    qrcode.makeCode(message);
  }
});