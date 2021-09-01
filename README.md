# test_chime_recording
## This repository was created to investigate chime recording

This repository contains 2 folders, `client-chime` and `server-chime`.
### `client-chime` contains code realted to front-end side
### `server-chime` contains code related to back-end side (server). 

Firstly, you need to run the server into [ngrok](https://ngrok.com/) (secure URL to your localhost server)

In the server-chime project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

## Available Scripts

This (client-chime) project was bootstrapped with [Create React AppAWS](https://github.com/facebook/create-react-app.
In the client-chime project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Steps to reproduce my problem:

I have an AWS account with next policies
```
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "chime:*"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Action": [
                "s3:ListBucket",
                "s3:ListAllMyBuckets",
                "s3:GetBucketAcl",
                "s3:GetBucketPolicy",
                "s3:GetBucketLocation",
                "s3:GetBucketLogging",
                "s3:GetBucketVersioning",
                "s3:GetBucketWebsite"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Action": [
                "logs:CreateLogDelivery",
                "logs:DeleteLogDelivery",
                "logs:GetLogDelivery",
                "logs:ListLogDeliveries",
                "logs:DescribeResourcePolicies",
                "logs:PutResourcePolicy",
                "logs:CreateLogGroup",
                "logs:DescribeLogGroups"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "sns:CreateTopic",
                "sns:GetTopicAttributes"
            ],
            "Resource": [
                "arn:aws:sns:*:*:ChimeVoiceConnector-Streaming*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "sqs:GetQueueAttributes",
                "sqs:CreateQueue"
            ],
            "Resource": [
                "arn:aws:sqs:*:*:ChimeVoiceConnector-Streaming*"
            ]
        },
        {
            "Action": [
                "kinesis:ListStreams"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "kinesis:DescribeStream"
            ],
            "Resource": [
                "arn:aws:kinesis:*:*:stream/chime-chat-*",
                "arn:aws:kinesis:*:*:stream/chime-messaging-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetEncryptionConfiguration",
                "s3:ListBucket",
                "s3:GetBucketPolicy",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::chime-chat-*"
            ]
        }
    ]
}
```
and 
```
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "*"
        }
    ]
}
```
also i created and s3 bucket in *us-east-1* region, 
![image](https://user-images.githubusercontent.com/81754827/131679470-8ba7c7af-6356-4d71-994c-8a1f4d753f25.png)

with policies
```
 {
    "Version": "2012-10-17",
    "Id": "AWSChimeMediaCaptureBucketPolicy",
    "Statement": [
        {
            "Sid": "AWSChimeMediaCaptureBucketPolicy",
            "Effect": "Allow",
            "Principal": {
                "Service": "chime.amazonaws.com"
            },
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetBucketPolicy",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::us2-dev-i-video-breakout-room-recording-test3",
                "arn:aws:s3:::us2-dev-i-video-breakout-room-recording-test3/*"
            ]
        }
    ]
}
```
also account from which i do all operations is bucket owner
To do all operations i use aws-sdk version 2.978.0 all operations i do in *us-east-1* region.
Here code sample
```
 const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');
```
So, when i successfully created meeting using chime
![image](https://user-images.githubusercontent.com/81754827/131679807-8a3b291c-94cc-4c97-b69d-855012cc76f4.png)
and add an attendee
![image](https://user-images.githubusercontent.com/81754827/131679910-563e89fe-a8b0-4583-a74b-240d0360bd8e.png)
        
I get an error on createMediaCapturePipeline step
![image](https://user-images.githubusercontent.com/81754827/131679991-2d62434f-161f-4743-9dec-481ae20ea322.png)        
Error with this fields:
```
  "message": "AWS authorization failed",
  "code": "Forbidden",
  "time": "2021-08-31T16:34:50.736Z",
  "requestId": "ceffc21c-4e64-498b-b1b2-a2c69f2a121c",
  "statusCode": 403,
  "retryable": false,
  "retryDelay": 28.619709654107027 
```
