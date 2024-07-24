import React, { useState, useEffect, useRef } from 'react';
import { MdMicOff, MdMic, MdVideocamOff, MdVideocam } from 'react-icons/md';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

const socket = io('https://codemorph.onrender.com');

function CodeShare() {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());
  const [vidchat, setVidchat] = useState(false);
  const [videoButtonText, setVideoButtonText] = useState('Start Video Chat');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    socket.emit('join-room', id);

    const handleCodeUpdate = (newCode) => {
      setCode(newCode);
    };

    socket.on('code-update', handleCodeUpdate);

    return () => {
      socket.emit('leave-room', id);
      socket.off('code-update', handleCodeUpdate);
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const connectCode = (event) => {
    const inputCode = event.target.value;
    setUniqueId(inputCode);
    console.log(inputCode);
  };

  const joinRoom = () => {
    navigate(`/code-share/${uniqueId}`);
  };

  const handleChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode, id);
  };

  const handleVideoChatToggle = async () => {
    if (!vidchat) {
      try {
        setVidchat(true);
        setVideoButtonText('Stop Video Chat');
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;
        localStreamRef.current = localStream;

        const peerConnection = new RTCPeerConnection({
          iceServers: [
            {
              urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
          ],
          iceCandidatePoolSize: 10,
        });
        peerConnectionRef.current = peerConnection;

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Local ICE candidate:', event.candidate);
            socket.emit('ice-candidate', { roomId: id, candidate: event.candidate });
          } else {
            console.log('All local ICE candidates have been sent');
          }
        };

        peerConnection.ontrack = (event) => {
          console.log('Received remote stream:', event.streams[0]);
          event.streams[0].getTracks().forEach(track => remoteStreamRef.current.addTrack(track));
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        };

        socket.on('offer', async ({ offer, socketId }) => {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('answer', { roomId: id, answer, socketId });
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        });

        socket.on('answer', async ({ answer }) => {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (error) {
            console.error('Error handling answer:', error);
          }
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('Remote ICE candidate added successfully:', candidate);
          } catch (error) {
            console.error('Error adding remote ICE candidate:', error);
          }
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', { roomId: id, offer });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      setVidchat(false);
      setVideoButtonText('Start Video Chat');
    }
  };

  const handleMuteToggle = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleCameraToggle = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center w-screen h-screen backgroundimage gap-4">
        <h1 className="text-white font-bold text-5xl">Code Share</h1>
        <div className="flex justify-between gap-10 w-[90vw] text-white font-bold">
          <div className="flex gap-5 justify-center items-center">
            <h1>ROOM ID: {id}</h1>
            <button className="bg-white text-black px-2 py-1 rounded hover:bg-black hover:text-white" onClick={() => navigator.clipboard.writeText(id)}>COPY</button>
          </div>
          <div className="flex gap-5 justify-center items-center">
            <TextField
              id="outlined-basic"
              label="Enter code to connect"
              variant="outlined"
              value={uniqueId}
              onChange={connectCode}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'lightgray', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'lightblue', // Border color when focused
                  },
                  '& input': {
                    color: 'white', // Text color
                    height: '20px'
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white', // Label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'lightblue', // Label color when focused
                },
              }}
            />
            <button className="bg-white text-black px-2 py-1 rounded hover:bg-black hover:text-white" onClick={joinRoom}>
              CONNECT
            </button>
            <button className="bg-white text-black px-2 py-1 rounded hover:bg-black hover:text-white" onClick={handleVideoChatToggle}>
              {videoButtonText}
            </button>
          </div>
        </div>
        <div className='flex gap-20'>
          <CodeEditor code={code} onChange={handleChange} />
          {vidchat && (
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-col items-center relative">
                <h2 className="text-white text-xl font-bold mb-2">Local Video</h2>
                <div className="relative w-52 h-40 bg-gray-800 rounded-md overflow-hidden">
                  <video ref={localVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                  {/* Add controls for local video */}
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <button className="p-2 bg-gray-700 rounded-full text-white" onClick={handleMuteToggle}>
                      {isMuted ? <MdMicOff size={24} /> : <MdMic size={24} />}
                    </button>
                    <button className="p-2 bg-gray-700 rounded-full text-white" onClick={handleCameraToggle}>
                      {isVideoOff ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center relative">
                <h2 className="text-white text-xl font-bold mb-2">Remote Video</h2>
                <div className="relative w-52 h-40 bg-gray-800 rounded-md overflow-hidden">
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CodeShare;
