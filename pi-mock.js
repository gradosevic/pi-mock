/**
 * PiMock
 *
 * Mock Pi SDK library functions for development
 */
(function () {

    var uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var _pm = {

        initialized: false,

        //Initial Pi Mock configuration
        configuration: {
            production_domain: false,
            username: 'john_doe',
            uid: false,
            payment_found: false,
            payment_error: false,
            payment_cancelled: false,
            debug: false
        },

        //Disable Pi Mock on production domain
        isProductionDomain: function () {
            return _pm.configuration.production_domain && window.location.hostname === _pm.configuration.production_domain;
        },

        debug: function (message, data = null) {
            if (this.configuration.debug) {
                if(data) {
                    console.log('PiMock: ' + message, data);
                }else {
                    console.log('PiMock: ' + message);
                }
            }
        },

        /**
         * Mocks Pi SDK "authenticate" method
         */
        mockAuthenticate: function () {
            window.Pi.authenticate = function (scopes, onOpenPaymentFound) {
                _pm.debug('Calling mock "Pi.authenticate"...');
                if (_pm.configuration.payment_found) {
                    _pm.debug('Payment already exists');
                    window.setTimeout(function () {
                        _pm.debug('Calling "onOpenPaymentFound"...');
                        onOpenPaymentFound({
                            "identifier": (uuidv4().replaceAll('-', '')).substring(4),
                            "user_uid": _pm.configuration.uid || uuidv4(),
                            "amount": _pm.configuration.payment_found.amount,
                            "memo": _pm.configuration.payment_found.memo,
                            "metadata": _pm.configuration.payment_found.metadata,
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
                    const response = {
                        "user":
                            {
                                "username": _pm.configuration.username || 'john_doe',
                                "uid": _pm.configuration.uid || uuidv4(),
                                "roles": ["email_verified"]
                            }, "accessToken": "1234567-1234567890AX31-1234567890aN10zfuoCE"
                    };
                    _pm.debug('"Pi.authenticate" returned response', response);
                    resolve(response);
                });
            }
        },

        /**
         * Mocks Pi SDK "createPayment" method
         */
        mockCreatePayment: function () {
            window.Pi.createPayment = function (data, handlers) {
                _pm.debug('Calling mock "Pi.createPayment"...');
                var paymentId = uuidv4();
                var txnId = uuidv4();
                if (_pm.configuration.payment_error && handlers.onError) {
                    //TODO: Set correct expected data for onError event handler
                    _pm.debug('"Pi.createPayment:onError" handler called');
                    handlers.onError('PiMock: Mocked error occurred', {
                        "identifier": paymentId
                    });
                } else if (_pm.configuration.payment_cancelled && handlers.onCancel) {
                    //TODO: Set correct expected data for onCancel event handler
                    _pm.debug('"Pi.createPayment:onCancel(' + paymentId + ')" handler called');
                    handlers.onCancel(paymentId);
                } else if (handlers.onReadyForServerApproval && handlers.onReadyForServerCompletion) {
                    //TODO: Set correct expected data for onReadyForServerApproval event handler
                    _pm.debug('"Pi.createPayment:onReadyForServerApproval(' + paymentId + ')" handler called');
                    handlers.onReadyForServerApproval(paymentId);
                    window.setTimeout(function () {
                        //TODO: Set correct expected data for onReadyForServerCompletion event handler
                        _pm.debug('"Pi.createPayment:onReadyForServerCompletion(' + paymentId + ', ' + txnId + ')" handler called');
                        handlers.onReadyForServerCompletion(paymentId, txnId);
                    }, 2000);
                } else {
                    alert('PiMock: Please define event handlers in "createPayment" method');
                }
            }
        },
        mockPiMethods: function () {
            this.mockAuthenticate();
            this.mockCreatePayment();
        }
    };

    window.PiMock = function (config) {
        Object.assign(_pm.configuration, config);
        if(!_pm.isProductionDomain() && !_pm.initialized){
            if (_pm.configuration.production_domain) {
                _pm.debug('Current domain is: ' +  window.location.hostname);
            }
            _pm.debug('Mocking Pi SDK methods...');
            _pm.mockPiMethods();
            _pm.initialized = true;
            _pm.debug('Configuration', _pm.configuration);
            _pm.debug('Pi SDK methods mocked successfully!');
        }
    }

})();
