//Variables
const body = document.querySelector('body')
//Payment vars
const DMS = document.getElementById('DMS')
const saveCard = document.getElementById('saveCard')
const reccuring = document.getElementById('reccuring')
const QR = document.getElementById('QR')
const PAN = document.getElementById('PAN')
const EP = document.getElementById('EP')
const IB = document.getElementById('IB')
const AP = document.getElementById('AP')
const amount = document.getElementById('amount')
const currency = document.getElementById('currency')
const language = document.querySelectorAll('#language')
const amountBtns = document.querySelectorAll('#amountBtn')
const statusClmn = document.querySelectorAll('#status_ind')
const btnLoader = document.getElementById('btnLoader')
const btnLoaderRefund = document.getElementById('btnLoaderRefund')
const btnLoaderCompl = document.getElementById('btnLoaderCompl')
const refInp = document.getElementById('refInp')
const compInp = document.getElementById('compInp')
const refPayId = document.getElementById('refPayId')
const compPayId = document.getElementById('compPayId')
const myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"), {});
const refundModal = new bootstrap.Modal(document.getElementById("staticBackdrop2"), {});
const complitionModal = new bootstrap.Modal(document.getElementById("staticBackdrop3"), {});
const logModal = new bootstrap.Modal(document.getElementById("staticBackdrop4"), {});
const qrModal = new bootstrap.Modal(document.getElementById("staticBackdrop5"), {});
const logarea = document.getElementById('logarea');
const tbody = document.querySelector('.table').getElementsByTagName('tbody')[0]
const ownerInp = document.getElementById('ownerInp');
const toolTips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const CardMsgArea = document.querySelector('.CardMsgArea')
const paginationArea = document.querySelector('.pagination')
const QRArea = document.getElementById('qrcode');
const qrResult = document.getElementById('qrResult');
let payWithCard = false

//hidden elemetns
const cardOwner = document.getElementById('cardOwner')
cardOwner.style.display = 'none'
const cardsList = document.getElementById('cardsList')
cardsList.style.display = 'none'