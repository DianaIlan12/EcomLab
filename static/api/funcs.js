//Enable tooltip
var tooltipTriggerList = [].slice.call(toolTips)
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

amountBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let val = parseFloat(btn.innerText);
    amount.value = val;
  })
})

const refreshCards = async () => {
  await fetchCards()
    .then(cards => {
      if (cards.length <= 0) {
        cardsList.innerHTML = ""
        reccuring.value = ""
        CardMsgArea.innerHTML = `
          <p style="font-size: 11px; margin:0; padding:0;" class="text-danger">დამახსოვრებული ბარათები არ მოიძებნა!</p>
  `
        reccuring.checked = false
        saveCard.disabled = false
        QR.checked = true
        QR.disabled = false
        EP.checked = true
        EP.disabled = false
        IB.checked = true
        IB.disabled = false
        AP.checked = true
        AP.disabled = false

        setTimeout(() => { CardMsgArea.innerHTML = '' }, 2000)
      } else {
        cardsList.innerHTML = ""
        reccuring.value = ""
        cards.forEach(card => {
          drawCard(card.cardMask.charAt(0) == "4" ? "VISA" : "MC", card.owner, card.expiryDate, card.cardMask, card.recId)
        })
      }
    })
}