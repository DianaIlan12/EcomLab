const axios = require('axios')
const _LOG_METHODS = require('./Logs')

const _TBC_METHODS = {}

//GET Token
_TBC_METHODS.getToken = async () => {

    const data = new URLSearchParams();
    data.append("client_id", process.env.CLIENT_ID);
    data.append("client_secret", process.env.CLIENT_SECRET);
    const options = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ApiKey: process.env.TBC_API_KEY,
        },
    };

    return axios
        .post("https://api.tbcbank.ge/v1/tpay/access-token", data, options)
        .then((res) => {
            return res.data.access_token;
        })
        .catch((error) => {
            return error.message;
        });
}
//Create Payment
_TBC_METHODS.createPayment = async (payData) => {

    const data = {
        ...payData,
        callbackUrl: process.env.CALLBACK_URL,
        skipInfoMessage: true,
        "extra": "GE68TB7318736080100007",
        "extra2": 0.01
    }
    const options = {
        headers: {
            "Content-Type": "application/json",
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    };

    return axios.post("https://api.tbcbank.ge/v1/tpay/payments", data, options)
        .then(async (res) => {

            let reqData = JSON.stringify(data)
            let resData = JSON.stringify(res.data)

            _LOG_METHODS.create(res.data.payId, reqData, resData)

            return { result: "ok", details: res.data };
        })
        .catch((error) => {
            let reason = ''
            if (error.response.data) {
                reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
            } else {
                reason = error.message
            }
            return {
                result: "failed",
                details: reason
            };
        });
}
//GET payment
_TBC_METHODS.getPayment = async (payId) => {

    let URI = `https://api.tbcbank.ge/v1/tpay/payments/${payId}`

    return axios.get(URI, {
        headers: {
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    }).then(async (res) => {
        
        let resData = JSON.stringify(res.data)

        await _LOG_METHODS.create(payId, `/${res.data.payId} GET`, resData)
        return { result: "ok", details: res.data };
    })
        .catch((error) => {
            let reason = ''
            if (error.response.data) {
                reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
            } else {
                reason = error.message
            }
            return {
                result: "failed",
                details: reason
            };
        });
}
//Cancel Payment
_TBC_METHODS.cancelPayment = async (payId, money) => {

    let URI = `https://api.tbcbank.ge/v1/tpay/payments/${payId}/cancel`

    return axios.post(URI, {
        amount: money
    }, {
        headers: {
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    }).then(async (res) => {

        let reqData = JSON.stringify({ amount: money })
        let resData = JSON.stringify(res.data)
        
        await _LOG_METHODS.create(payId, reqData, resData)
        return { result: "ok", details: res.data };
    })
        .catch((error) => {
            let reason = ''
            if (error.response.data) {
                reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
            } else {
                reason = error.message
            }
            return {
                result: "failed",
                details: reason
            };
        });
}
//Complete Pre-Auth
_TBC_METHODS.completePayment = async (payId, money) => {

    let URI = `https://api.tbcbank.ge/v1/tpay/payments/${payId}/completion`

    return axios.post(URI, {
        amount: money
    }, {
        headers: {
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    }).then(async (res) => {

        let reqData = JSON.stringify({ amount: money })
        let resData = JSON.stringify(res.data)
        
        await _LOG_METHODS.create(payId, reqData, resData)
        return { result: "ok", details: res.data };
    })
        .catch((error) => {
            let reason = ''
            if (error.response.data) {
                reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
            } else {
                reason = error.message
            }
            return {
                result: "failed",
                details: reason
            };
        });
}

//Execute reccuring payment
_TBC_METHODS.execPayment = async (payData) => {

    const URI = 'https://api.tbcbank.ge/v1/tpay/payments/execution';
    return axios.post(URI, {
        ...payData
    }, {
        headers: {
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    }).then(async (res) => {

        let reqData = JSON.stringify(payData)
        let resData = JSON.stringify(res.data)
        
        await _LOG_METHODS.create(res.data.payId, reqData, resData)
        return { result: "ok", details: res.data };
    }).catch((error) => {
        let reason = ''
        if (error.response.data) {
            reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
        } else {
            reason = error.message
        }
        return {
            result: "failed",
            details: reason
        };
    });
}

//Delete saved card
_TBC_METHODS.rmRecId = async (recId) => {

    let URI = `https://api.tbcbank.ge/v1/tpay/payments/${recId}/delete`

    return axios.post(URI, null, {
        headers: {
            ApiKey: process.env.TBC_API_KEY,
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
    }).then((res) => {
        return { result: "ok", details: res.data };
    })
        .catch((error) => {
            let reason = ''
            if (error.response.data) {
                reason = error.response.data.detail.length == 0 ? error.response.data.systemCode : error.response.data.detail
            } else {
                reason = error.message
            }
            return {
                result: "failed",
                details: reason
            };
        });
}

module.exports = _TBC_METHODS
