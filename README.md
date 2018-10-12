# Smartlook Node.js SDK

This small zero-dependency library can be used to send custom events to [Smartlook](https://www.smartlook.com) from your backend Node.js services.

These events can be then views in the events tab and you can use them to create funnels.

If you need to use these events to filter the recordings, you have to send `smartlook.vid` and `smartlook.sid` provided by the frontend Smartlook library in the request to your backend service.

However it is not required and you can use the events to track something not related to the user sessions or someting that happens outside of user session. Set the event `vid` to whatever you want to be identified as a source of the event (eg. your internal user id or job id).

You could have for example a background sequence of jobs that should trigger a user activity in the end. You can track with Smartlook how successful this process is. Such case would be checking last user activity on your web, sending an email to remind them your service or let them know about some news and the last event would be user login.

## Usage

```
$ npm install @smartlook/nodejs-sdk
```

```
const smartlook = require('@smartlook/nodejs-sdk')

// set the key directly or with SMARTLOOK_KEY env variable
smartlook.init({
	key: '<PROJECT KEY>',
})

smartlook.event({
	vid: '<SOURCE ID>',
	name: '<EVENT NAME>',
})
```

Check out a bit more comprehensive [example](example/index.js).

## API

### **smartlook.init**

Initializes the SDK with your deploy `key` and starts batch uploading of the events every `flushIntervalMillis`.

| **Parameter** | **Environment variable** | **Default** | **Allowed** |
| --- | --- | --- | --- |
| key | SMARTLOOK_KEY | null | string |
| flushIntervalMillis | SMARTLOOK_FLUSH_INTERVAL_MILLIS | 10000 | integer |
| logLevel | SMARTLOOK_LOG_LEVEL | error | mute/trace/debug/info/error |

### **smartlook.stop**

Uploads pending events and stops recording of new events.

### **smartlook.event**

Creates a new custom event.

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| vid | string | (required) Event source entity identifier |
| name | string | (required) Event name |
| value | string | Event value |
| props | object | Event key/value properties |
| sid | string | User session id obtained from the frontend Smarltook library |

## Contributing

Pull requests for new features, bug fixes, and suggestions are welcome!

## License

[MIT](LICENSE)