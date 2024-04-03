//API calls
const fetchData = async (page) => {
  tbody.innerHTML = skeleton(10)

  const paymentsData = await fetch(`api/payment?page=${page ? page : ''}`).then(resp => resp.json()).then(data => data)
  if (paymentsData.length <= 0) {
    tbody.innerText = "No data available!"
  } else {
    tbody.innerText = ''
  }
  paymentsData.data.forEach(payment => {
    const tr = document.createElement('tr')
    const date = new Date(payment.createdAt)
    tr.innerHTML = `
      <td scope="row">${payment.payId}</td>
      <td scope="row">${date.toLocaleString()}</td>
      <td scope="row">${payment.currency}</td>
      <td scope="row">${payment.amount}</td>
      <td scope="row" class="${payment.status === "Succeeded" ? "text-success" : payment.status === "Failed" ? "text-danger" : payment.status === "Created" ? "text-primary" : null}">${payment.status === "Created" ? '<a href="https://ecom.tbcpayments.ge/Pay/choose/' + payment.payId + '?lang=ka">' + payment.status + '</a>' : payment.status}</td>
      <td scope="row">${payment.preAuth ? "DMS" : "SMS"}</td>
      <!-- <td scope="row">${payment.saveCard ? "YES" : "NO"}</td> -->
      <td scope="row">${payment.paymentMethod}</td>
      <td scope="row">${payment.cardMask}</td>
      <td scope="row">${payment.confirmedAmount}</td>
      <td scope="row">${payment.returnedAmount}</td>
      <td scope="row">
      <div class="payment_tools btn-group">
      <button class="btn btn-secondary btn-sm" value="${payment.payId}" onclick="getLog(event)">Logs</button>
      ${payment.status === "Succeeded" || payment.status === "WaitingConfirm" ? `<button class="btn btn-secondary btn-sm" value="${payment.payId}" onclick="refundPayment(event, ${payment.amount})">Refund</button>` : ''
      }
      ${payment.status === "WaitingConfirm" ? `<button class="btn btn-secondary btn-sm" value="${payment.payId}" onclick="completePayment(event, ${payment.amount})">Complition</button>` : ''
      }
      </div>
      </td>
      `;
    tbody.appendChild(tr)
  })

  paginationArea.innerHTML = ''

  if (paymentsData.currentPage == 1) {
    drawPaginationitem('Previous', '', 'disabled')
  } else {
    drawPaginationitem('Previous', paymentsData.currentPage - 1)
  }
  if (paymentsData.currentPage !== 1) {
    drawPaginationitem(1, 1)
    drawPaginationitem('...', '...', 'disabled')
  }
  const pageArr = (paginator => {
    const pagesLength = 4
    const start = paymentsData.currentPage + pagesLength < paymentsData.totalPages ? paymentsData.currentPage : paymentsData.totalPages - pagesLength;
    const end = paymentsData.currentPage + pagesLength < paymentsData.totalPages ? paymentsData.currentPage + pagesLength : paymentsData.totalPages;
    const step = 1;
    const arrayLength = Math.floor(((end - start) / step)) + 1;
    const range = [...Array(arrayLength).keys()].map(x => (x * step) + start);
    return range
  })()

  pageArr.forEach(page => drawPaginationitem(page, page, page == paymentsData.currentPage ? 'active' : null))

  if (paymentsData.totalPages - 4 > paymentsData.currentPage) {
    drawPaginationitem('...', '...', 'disabled')
    drawPaginationitem(paymentsData.totalPages, paymentsData.totalPages)
  }
  if (paymentsData.currentPage === paymentsData.totalPages) {
    drawPaginationitem('Next', '', 'disabled')
  } else {
    drawPaginationitem('Next', paymentsData.currentPage + 1)
  }
}

fetchData(1)

const startPayment = (event) => {
  event.target.disabled = true;
  btnLoader.classList.remove('d-none')
  let Pamount = amount.value
  let Pcurrency = currency.options[currency.selectedIndex].value;
  let Pmethods = []
  QR.checked && Pmethods.push(QR.value)
  PAN.checked && Pmethods.push(PAN.value)
  EP.checked && Pmethods.push(EP.value)
  IB.checked && Pmethods.push(IB.value)
  AP.checked && Pmethods.push(AP.value)
  let PpreAuth = DMS.checked
  let PsaveCard = saveCard.checked
  let PcardOwner = ownerInp.value
  let Planguage = ""
  let PrecId = reccuring.value
  language[0].checked ? Planguage = "KA" : language[1].checked ? Planguage = "EN" : language[2].checked ? Planguage = "RU" : "KA"

  let payData = {
    amount: { currency: Pcurrency, total: parseFloat(Pamount) },
    methods: Pmethods,
    preAuth: PpreAuth,
    saveCard: PsaveCard,
    language: Planguage,
    cardOwner: PcardOwner
  }

  if (reccuring.value.length > 0) {
    // We should proceed reccuring payment
    fetch('/api/payment/execution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        money: { currency: Pcurrency, amount: parseFloat(Pamount) },
        preAuth: PpreAuth,
        recId: PrecId
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        event.target.disabled = false;
        btnLoader.classList.add('d-none')
        myModal.hide()
        if (data.result === 'failed') {
          fetchData()
          AlertMsg(2, data.details, 4)
        } else {
          fetchData()
          AlertMsg(0, "წარმატებით შესრულდა", 4)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    // Go and proccess regular payment
    fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payData),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        event.target.disabled = false;
        btnLoader.classList.add('d-none')
        myModal.hide()
        if (data.result === 'failed') {
          AlertMsg(2, data.details, 4)
          fetchData()
        } else {
          location = data.links[1].uri;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

const fetchCards = () => {
  return fetch('/api/card')
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch((error) => {
      return error
    });
}

const deleteCardByRecId = async (event) => {
  let btnLoaderDeleteCard = document.getElementById(`btnLoaderDeleteCard-${event.target.value}`)
  event.target.disabled = true;
  btnLoaderDeleteCard.classList.remove('d-none')
  fetch(`/api/card/${event.target.value}`, { method: 'DELETE' })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.result === 'failed') {
        btnLoaderDeleteCard.classList.add('d-none')
        CardMsgArea.innerHTML = `
        <p style="font-size: 11px; margin:0; padding:0;" class="text-danger">ბარათის წაშლა ვერ ხერხდება! მიზეზი: ${data.details}</p>
`
        setTimeout(() => {
          CardMsgArea.innerHTML = ''
          event.target.disabled = false;
        }, 5000)
      } else {
        refreshCards()
      }
    })
    .catch(err => {
      console.log(err.message)
    })
}

const refundPaymentPrc = (event) => {
  event.target.disabled = true;
  btnLoaderRefund.classList.remove('d-none')
  fetch(`/api/payment/${refPayId.value}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: refInp.value }),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      event.target.disabled = false;
      btnLoaderRefund.classList.add('d-none')
      refundModal.hide()
      if (data.result === 'ok') {
        fetchData()
        AlertMsg(0, 'Successfully Returned!', 5)
      } else if (data.result === 'failed') {
        AlertMsg(2, data.details, 5)
      } else {
        AlertMsg(2, "Failed. Uknown reason, please contact administrator!", 5)
      }
    })
    .catch((error) => {
      AlertMsg(2, error.message, 5)
    });
}

const completePaymentPrc = (event) => {
  event.target.disabled = true;
  btnLoaderCompl.classList.remove('d-none')
  fetch(`/api/payment/${compPayId.value}/completion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: compInp.value }),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      event.target.disabled = false;
      btnLoaderCompl.classList.add('d-none')
      complitionModal.hide()
      if (data.result === 'ok') {
        fetchData()
        AlertMsg(0, 'Complition Done!', 5)
      } else if (data.result === 'failed') {
        AlertMsg(2, data.details, 5)
      } else {
        AlertMsg(2, "Failed. Uknown reason, please contact administrator!", 5)
      }
    })
    .catch((error) => {
      AlertMsg(2, error.message, 2)
    });
}

const qrPayment = async () => {
  QRArea.innerHTML = ''
  qrResult.innerHTML = ''
  qrResult.style.visibility = 'hidden'

  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "amount": {
        "currency": "GEL",
        "total": 0.05
      },
      "methods": [
        "4"
      ],
      "preAuth": false,
      "saveCard": false,
      "language": "KA",
      "expirationMinutes": 1
    })
  })
  const qrData = await response.json()

  const qrResponse = await fetch(`/api/payment/qr/${qrData.payId}`)
}