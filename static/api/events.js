saveCard.addEventListener('change', () => {
    if (saveCard.checked) {
        reccuring.disabled = true
        QR.checked = false
        QR.disabled = true
        PAN.checked = true
        EP.checked = false
        EP.disabled = true
        IB.checked = true
        IB.disabled = false
        AP.checked = false
        AP.disabled = true
        cardOwner.style.display = 'flex'
    } else {
        reccuring.disabled = false
        QR.checked = true
        QR.disabled = false
        EP.checked = true
        EP.disabled = false
        IB.checked = true
        IB.disabled = false
        AP.checked = true
        AP.disabled = false
        cardOwner.style.display = 'none'
    }
})

reccuring.addEventListener('change', async () => {
    if (reccuring.checked) {
        saveCard.disabled = true
        QR.checked = false
        QR.disabled = true
        PAN.checked = true
        EP.checked = false
        EP.disabled = true
        IB.checked = false
        IB.disabled = true
        AP.checked = false
        AP.disabled = true
        cardsList.style.display = 'flex'
        refreshCards()
    } else {
        saveCard.disabled = false
        QR.checked = true
        QR.disabled = false
        EP.checked = true
        EP.disabled = false
        IB.checked = true
        IB.disabled = false
        AP.checked = true
        AP.disabled = false
        cardsList.style.display = 'none'
        refreshCards()
    }
})

const chooseCard = (event) => {
    let allCards = document.querySelectorAll('.savedcard')
    let currentCard = event.target.parentNode.parentNode

    if (Array.from(currentCard.classList).includes('active')) {
        allCards.forEach((card, index, cards) => {
            card.classList.remove('active')
            card.childNodes[5].childNodes[1].innerText = "აირჩიე გადასახდელად"
        })
        reccuring.value = ""
        payWithCard = !payWithCard
    } else {
        payWithCard = !payWithCard
        reccuring.value = event.target.value
        event.target.innerText = "ბარათი არჩეულია"
        currentCard.classList.add('active')

        allCards.forEach((card, index, cards) => {
            if (card !== currentCard) {
                card.classList.remove('active')
                card.childNodes[5].childNodes[1].innerText = "აირჩიე გადასახდელად"
            }
        })
    }
}

const refundPayment = (event, amount) => {
    refInp.value = amount
    refPayId.value = event.target.value
    refundModal.show()
}

const completePayment = (event, amount) => {
    compInp.value = amount
    compPayId.value = event.target.value
    complitionModal.show()
}

const getLog = (event) => {
    logarea.innerText = ''
    fetch(`/api/payment/log/${event.target.value}`)
        .then(res => res.json())
        .then(data => {
            if (data.length <= 0) {
                AlertMsg(1, 'Log not found', 5)
            } else {
                logModal.show()
                data.forEach(d => {
                    const tr = document.createElement('tr')
                    const td2 = document.createElement('td')
                    const td3 = document.createElement('td')
                    td2.setAttribute('scope', 'row')
                    td2.style.whiteSpace = "pre"
                    td2.style.fontSize = '12px'
                    td2.style.backgroundColor = '#2b2b2b'
                    td2.style.borderRight = '0.5px solid white'
                    td3.setAttribute('scope', 'row')
                    td3.style.whiteSpace = "pre"
                    td3.style.fontSize = '12px'
                    td3.style.backgroundColor = '#2b2b2b'
                    td2.innerHTML = `<pre><code class="hljs language-json">${d.request[0] == '/' ? d.request : JSON.stringify(JSON.parse(d.request), null, 4)}</code></pre>`
                    td3.innerHTML = `<pre><code class="hljs language-json">${JSON.stringify(JSON.parse(d.response), null, 4)}</code></pre>`
                    tr.appendChild(td2)
                    tr.appendChild(td3)
                    logarea.appendChild(tr)
                    document.querySelectorAll('pre code').forEach((el) => {
                        hljs.highlightElement(el);
                    });
                })
            }
        })
        .catch(err => AlertMsg(2, err, 5))
}
