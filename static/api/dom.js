const skeleton = num => {
  let content = ''

  for(let i = 0; i < num; i++) {
    content += `
    <tr>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    <td scope="row" class="skeleton"></td>
    </tr>
    `
  }

  return content
}

//DOM
const AlertMsg = (type, text, sec) => {
  const body = document.querySelector('body')
  const alertTypes = ["success", "warning", "danger"]
  const alertRoot = document.createElement('div')
  alertRoot.innerHTML = `
    <div
      style="z-index: 1000;"
      class="alert alert-${alertTypes[type]} alert-dismissible fade show position-absolute top-0 end-0 vw-30 mt-3 me-3"
      role="alert"
    >
      ${text}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
    `;
  body.prepend(alertRoot)
  setTimeout(() => {
    alertRoot.remove()
  }, sec * 1000)
};

const drawPaginationitem = (pageText, pageNumber, option) => {
  const li = document.createElement('li')
  li.classList.add(`page-item`)
  li.style.cursor = 'pointer'
  option === 'disabled' ? li.classList.add('disabled') : option === 'active' ? li.classList.add('active') : null
  const a = document.createElement('a')
  a.classList.add('page-link')
  a.innerText = pageText
  a.onclick = () => {fetchData(pageNumber)}
  li.appendChild(a)
  paginationArea.appendChild(li)

}

const drawCard = (type, holder, exp, pan, recId) => {
  let panArr = pan.match(/.{1,4}/g)
  let card = document.createElement('div');
  card.classList.add('savedcard')
  card.innerHTML = `
      <div class="cardz m-2" for="${recId}">
        <div class="d-flex justify-content-between align-items-center">
          <img src="/static/imgs/chip.png" width="30" class="m-2" />
          ${type === 'VISA' ? '<img src="/static/imgs/visa.png" width="50" class="m-2" />' : '<img src="/static/imgs/mc.png" width="50" class="m-2" />'}
        </div>
        <div class="px-2 number mt-2 d-flex justify-content-between align-items-center">
          <span>${panArr[0]}</span>
          <span>${panArr[1]}</span>
          <span>${panArr[2]}</span>
          <span>${panArr[3]}</span>
        </div>
        <div class="p-2 card-border mt-2">
          <div class="d-flex justify-content-between align-items-center">
            <span class="cardholder">Card Holder</span>
            <span class="expires">Expires</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="name">${holder}</span>
            <span class="date">${exp !== null ? exp.match(/.{1,2}/g).join('/') : '00/00'}</span>
          </div>
        </div>
      </div>
      <div class="backdrp"></div>
      <div class="cardActions">
        <button id="payWithCard" type="button" class="btn btn-success" value="${recId}" onclick="chooseCard(event)">აირჩიე გადასახდელად</button>
        <button id="deleteCard" type="button" class="btn btn-danger" value="${recId}" onclick="deleteCardByRecId(event)">
        <span id="btnLoaderDeleteCard-${recId}" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
        ბარათის წაშლა
        </button>
      </div>
    `
  cardsList.prepend(card)
}