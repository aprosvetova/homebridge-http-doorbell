# homebridge-http-doorbell

This plugin offers you a doorbell that can be triggerd via an HTTP request.

## Installation

Run the following command
```
npm install -g homebridge-http-doorbell
```

Chances are you are going to need sudo with that.

## Config.json

This is an example configuration

```
"accessories" : [
    {
        "accessory": "http-doorbell",
        "name": "Front doorbell",
        "port": 9053,
        "duration": 2
    }
]
```

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| accessory     | Required. Has to be "http-doorbell"                                                |
| name          | Required. The name of this doorbell. This will appear in your homekit app          |
| port          | Required. The port that you want this plugin to listen on. Should be above 1024.   |
| duration      | Optional. Sets doorbell duration, 2 seconds by default.                            |