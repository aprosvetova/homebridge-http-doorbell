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
"platforms" : [
    {
        "platform": "http-doorbell",
        "port": 9053,
        "doorbells": [
            "name": "Front doorbell",
            "id": "front",
            "duration": 2
        ]
    }
]
```

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| platform      | Required. Has to be "http-doorbell"                                                |
| port          | Required. The port that you want this plugin to listen on. Should be above 1024.   |
| doorbells[].name | Required. The name of this doorbell. This will appear in your homekit app       |
| doorbells[].id | Optional. Sets doorbell id for webhook, seqeuntial from 1 by default              |
| doorbells[].duration | Optional. Sets doorbell duration, 2 seconds by default.                     |