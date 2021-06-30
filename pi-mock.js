//UUID Generator
if (typeof window.uuidv4 === 'undefined') {
    window.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

//Initialize Pi Mock configuration
if (!window.PiMockConfig) {
    window.PiMockConfig = {};
}

Pi.authenticate = function (scopes, onOpenPaymentFound) {
    if (PiMockConfig.payment_found) {
        window.setTimeout(function () {
            onOpenPaymentFound({
                "identifier": (uuidv4().replaceAll('-', '')).substring(4),
                "user_uid": PiMockConfig.uid || uuidv4(),
                "amount": PiMockConfig.payment_found.amount,
                "memo": PiMockConfig.payment_found.memo,
                "metadata": PiMockConfig.payment_found.metadata,
                "to_address": (uuidv4().replaceAll('-', '') + uuidv4().replaceAll('-', '')).substring(8).toUpperCase(),
                "status": {
                    "developer_approved": false,
                    "transaction_verified": false,
                    "developer_completed": false,
                    "cancelled": false,
                    "user_cancelled": false
                },
                "transaction": null,
                "created_at": (new Date()).toISOString()
            });
        }, 100);
    }
    return new Promise((resolve, reject) => {
        resolve({
            "user":
                {
                    "username": PiMockConfig.username || 'john_doe',
                    "uid": PiMockConfig.uid || uuidv4(),
                    "roles": ["email_verified"]
                }, "accessToken": "1234567-1234567890AX31-1234567890aN10zfuoCE"
        });
    });
}

Pi.createPayment = function (data, handlers) {
    if (PiMockConfig.payment_error && handlers.onError) {
        //TODO: Set correct expected data for onError event handler
        handlers.onError('PiMock: Mocked error occurred', {
            "identifier": (uuidv4())
        });
    } else if (PiMockConfig.payment_cancelled && handlers.onCancel) {
        //TODO: Set correct expected data for onCancel event handler
        handlers.onCancel(uuidv4());
    } else if (handlers.onReadyForServerApproval && handlers.onReadyForServerCompletion) {
        var paymentId = uuidv4();
        var txnId = uuidv4();
        //TODO: Set correct expected data for onReadyForServerApproval event handler
        handlers.onReadyForServerApproval(paymentId);
        window.setTimeout(function () {
            //TODO: Set correct expected data for onReadyForServerCompletion event handler
            handlers.onReadyForServerCompletion(paymentId, txnId);
        }, 2000);
    } else {
        alert('PiMock: Please define event handlers in "createPayment" method');
    }
}