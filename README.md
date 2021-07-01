# Pi Mock

This library can be used for the development purpose ONLY of the Pi Network Apps. It mocks Pi SDK methods on front-end and returns dummy
data, so you can focus on the front-end development and enable the real Pi library later.


## Installation

Please add the "pi-mock.js" script after Pi scripts:

```html

<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>Pi.init({version: "2.0"})</script>
```

like this:

```html

<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>Pi.init({version: "2.0"})</script>

<!-- Pi Mock script -->
<script src="/pi-mock.js"></script>
```

## Initialization

The minimum required initialization for Pi Mock is:

```javascript
    PiMock();
```

## Configuring

After including Pi Mock script, you can configure further the mocking behavior or pass the configuration directly into PiMock when initializing.
This is the full example with all configuration set:

```javascript
   PiMock({
    production_domain: false,
    username: 'john_doe',
    uid: '12345678-1234-414e-b578-42e89d1f3c02',
    payment_found: {
        amount: 1, // Amount of π to be paid
        memo: "Please pay for your order #12345", // User-facing explanation of the payment
        metadata: {orderId: 12345}, // Developer-facing metadata
    },
    payment_error: false,
    payment_cancelled: false,
    debug: true
});
```

By default, PiMock will call success event handlers.
- "onReadyForServerApproval" and
- "onReadyForServerCompletion", 2 seconds later

### Parameters

- **production_domain**: (Optional|Default:false). Production domain name or subdomain (e.g. "example.com" or "subdomain.example.com"). If set, it will disable Pi Mock in production and use real Pi SDK instead, so you don't need to change your code with Pi Mock for production
- **username**: (Optional|Default:"john_doe"). If set, it will return the provided username
- **uid**: (Optional|Default:false). If set it will always return the provided uid, if not, it will always generate new uid
- **payment_found**: (Optional|Default:false). Set this option with the expected payment object if you want to trigger "onOpenPaymentFound" event
- **payment_error** (Optional|Default:false). If set to "true" it will trigger error event on payment failure
- **payment_cancelled** (Optional|Default:false). If set to "true" it will trigger payment cancelled event
- **debug** (Optional|Default:false). If set to "true" it will print out useful information in dev console

## Known issues
Please note that expected data returned in event handlers might not be the same as expected in Pi library. Feel free to test and contribute so we can improve this.

## Tip
You can re-configure "PiMock()" also later in your code, passing different configuration so you can call and test multiple payment calls with different data and different expected events in sequence.

### Example

```javascript

    //Make Pi SDK returns mocked successful results
    PiMock();

    //.. your code to test successful transactions

    //Make Pi SDK returns errors
    PiMock({payment_error: true});

    //.. your code to test failed transactions

    //Make Pi SDK returns successful results again and shows debug messages in console
    PiMock({
        payment_error: false,
        debug: true
    });



```