import React, {useRef, useState} from 'react';
import './App.css';
import axios from 'axios'

import * as Chime from 'amazon-chime-sdk-js';

function App() {
    const SERVER="https://ea59-95-67-55-49.ngrok.io"
    const [meetingResponse, setMeetingResponse] = useState()
    const videoElement = useRef();
    let meetingSession;
    const startCall = async () => {
        const response = await axios.get(`${SERVER}/meeting`);

        setMeetingResponse(response.data.meetingResponse);
    }

    const joinVideoCall = async () => {
        await getExistingMeting();

        if (!meetingResponse) {
            return alert('There is no meeting right now!');
        }

        const meetingId = meetingResponse.Meeting.MeetingId;

        const response = await axios.get(`${SERVER}/add-attendee/${meetingId}`);

        const attendee = response.data.attendee;

        const logger = new Chime.ConsoleLogger('ChimeMeetingLogs', Chime.LogLevel.INFO);
        const deviceController = new Chime.DefaultDeviceController(logger);
        const configuration = new Chime.MeetingSessionConfiguration(meetingResponse, attendee);
        meetingSession = new Chime.DefaultMeetingSession(configuration, logger, deviceController);

        const observer = {
            audioVideoDidStart: () => {
                meetingSession.audioVideo.startLocalVideoTile();
            },
            videoTileDidUpdate: tileState => {
                meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement.current);
            }
        }

        meetingSession.audioVideo.addObserver(observer);
        const firstVideoDeviceId = (await meetingSession.audioVideo.listVideoInputDevices())[0].deviceId;
        await meetingSession.audioVideo.chooseVideoInputDevice(firstVideoDeviceId);
        meetingSession.audioVideo.start();
    }

    const deleteCall = async () => {
        await getExistingMeting();

        const meetingId = meetingResponse.Meeting.MeetingId;

        if (meetingId) {
            await axios.get(`${SERVER}/delete/${meetingId}`)
        }

        alert('Meeting deleted!');
    }

    const getExistingMeting = async () => {
        const response = await axios.get(`${SERVER}/existing-meeting`)

        if (!response.data.meetingResponse) {
            return;
        }

        setMeetingResponse(response.data.meetingResponse);
    };

    const startRecording = async () => {
        const response = await axios.get(`${SERVER}/meeting/start_recording`);

        console.log(response);
    };

    const stopRecording = async () => {
        const response = await axios.get(`${SERVER}/meeting/stop_recording`);

        console.log(response);
    }

    return (
        <div className="App">
            <header className="App-header">
                <video ref={videoElement}/>
                <button onClick={joinVideoCall}> join call</button>
                <button onClick={startCall}>start call</button>
                <button onClick={deleteCall}>Delete call</button>
                <button onClick={startRecording}>Start recording</button>
                <button onClick={stopRecording}>Stop recording</button>
            </header>

        </div>
    );
}

export default App;
