# Pi Mock

This library can be used for the development purpose ONLY of the Pi Network Apps. It mocks Pi methods and returns dummy
data, so you can focus on the development and enable the real Pi library later.

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

## Configuring

After including Pi Mock script, you can configure further the mockin behavior. This is the full Mock Configuring object:

```javascript
   window.PiMockConfig = {
    username: 'john_doe',
    uid: '12345678-1234-414e-b578-42e89d1f3c02',
    payment_found: {
        amount: 1, // Amount of π to be paid
        memo: "Please pay for your order #12345", // User-facing explanation of the payment
        metadata: {orderId: 12345}, // Developer-facing metadata
    },
    payment_error: false,
    payment_cancelled: false,
}
```

By default, this object is empty and will call success event handlers.
- "onReadyForServerApproval" and
- "onReadyForServerCompletion", 2 seconds later

### Parameters

- **username**: (Optional). If set, it will return the provided username
- **uid**: (Optional). If set it will always return the provided uid, if not, it will always generate new uid.
- **payment_found**: (Optional). Set this option with the expected payment object if you want to trigger "onOpenPaymentFound" event
- **payment_error** (Optional). If set to "true" it will trigger error event on payment failure
- **payment_cancelled** (Optional). If set to "true" it will trigger payment cancelled event

## Known issues
Please note that expected data returned in event handlers might not be the same as expected in Pi library. Feel free to test and contribute so we can improve this.

## Tip
You can re-configure "PiMockConfig" also later in your code, so you can call and test multiple payment calls with different data and different expected events in sequence.