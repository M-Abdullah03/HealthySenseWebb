import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { useParams } from 'react-router-dom';

const Meet = () => {

  const navigate = useNavigate();
  const name = "Moiz";
  const appId = "vpaas-magic-cookie-718c706ae06a47358bd331c069d34baa";
  const {id} = useParams();

  return (
    <div style={{ height: '100vh', display: 'grid', flexDirection: 'column', overflow: 'hidden' }}>
      <JaaSMeeting
        appId={appId}
        roomName={id}
        displayName={name}
        onApiReady={api => {
          api.on('displayNameChange', (e) => {
            if (e.displayName !== name) {
              api.executeCommand('displayName', name);
            }
          });

          api.on('videoConferenceLeft', () => {
            api.dispose();
            navigate('/');
          });
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: [
            'camera',
            'chat',
            'closedcaptions',
            'desktop',
            'download',
            'embedmeeting',
            'etherpad',
            'feedback',
            'filmstrip',
            'fullscreen',
            'hangup',
            'help',
            'livestreaming',
            'microphone',
            'mute-everyone',
            'mute-video-everyone',
            'participants-pane',
            'profile',
            'raisehand',
            'recording',
            'security',
            'select-background',
            'settings',
            'shareaudio',
            'sharedvideo',
            'shortcuts',
            'stats',
            'tileview',
            'toggle-camera',
            'videoquality',
          ],
        }}
      />
    </div>
  );
};

export default Meet;