const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const {v4: uuid} = require('uuid')
const cors = require('cors');
const bodyParser = require('body-parser');

const region = 'us-east-1';
const chime = new AWS.Chime({ region: region });

chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

let meeting = {};
let recordingPipelineId = '';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get('/meeting', cors(), async (req, res) => {
    try {
        const response = {};

        response.meetingResponse = await chime
            .createMeeting({
                ClientRequestToken: uuid(),
                MediaRegion: region,
            })
            .promise();


        meeting = response;

        res.send(response);
    } catch (err) {
        res.send(err)
    }
})

app.get('/meeting/start_recording', cors(), async (req, res) => {
    try {
        const meetingId = meeting.meetingResponse.Meeting.MeetingId;
        const response = {};
        const params = {
            SourceType: 'ChimeSdkMeeting',
            SourceArn: 'arn:aws:chime::614920527824:meeting:' + meetingId, /* required */
            SinkType: 'S3Bucket', /* required */
            SinkArn: 'arn:aws:s3:::us2-dev-i-video-breakout-room-recording-test3/captures/' + meetingId    , /* required */
        };
        response.data = await chime.createMediaCapturePipeline(params).promise();

        recordingPipelineId = response.data.MediaPipelineId;
        res.send(response);
    } catch (err) {
        res.send(err)
    }
})

app.get('/meeting/stop_recording', cors(), async (req, res) => {
    try {
        const response = {};
        var params = {
            MediaPipelineId: recordingPipelineId
        };
        response.data = await chime.deleteMediaCapturePipeline(params)
            .promise()

        res.send(response);
    } catch (err) {
        res.send(err)
    }
})

app.get('/list-attendee/:meetingId', cors(), async (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        const response = {};
        const params = {
            MeetingId: meetingId
        };

        response.attendees = await chime.listAttendees(params).promise();

        res.send(response);
    } catch (err) {
        res.send(err);
    }
});

app.get('/add-attendee/:meetingId', cors(), async (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        const response = {};

        response.attendee = await chime
            .createAttendee({
                MeetingId: meetingId,
                ExternalUserId: uuid(),
            })
            .promise()

        res.send(response);
    } catch (err) {
        res.send(err);
    }
});

app.get('/delete-attendee/:meetingId', cors(), async (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        const response = {};

        response.attendee = await chime
            .createAttendee({
                MeetingId: meetingId,
                ExternalUserId: uuid(),
            })
            .promise()

        res.send(response);
    } catch (err) {
        res.send(err);
    }
})

app.get('/delete/:meetingId', cors(), (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        const params = {
            MeetingId: meetingId
        };

        chime.deleteMeeting(params)
            .promise();

        res.send({message: 'Meeting was deleted!'});
    } catch (err) {
        res.send(err)
    }
})

app.get('/existing-meeting', cors(), (req, res) => {
    res.send(meeting);
})

app.listen(5000, () => console.log(`Video calling POC server listening at http://localhost:5000`))