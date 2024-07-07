import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4000');

function CodeShare() {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream()); // Store remote stream

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

  const handleStartVideoChat = async () => {
    try {
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
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center w-screen h-screen pt-9 bg-black gap-4">
        <h1 className="text-white font-bold text-5xl">Code Share</h1>
        <div className="flex justify-between gap-10 w-[90vw] text-white font-bold">
          <div className="flex gap-5 justify-center items-center">
            <h1>ROOM ID: {id}</h1>
            <button className="bg-white text-black px-2 py-1 rounded">COPY</button>
          </div>
          <div className="flex gap-5 justify-center items-center">
            <input
              type="text"
              placeholder="Enter code to connect"
              value={uniqueId}
              onChange={connectCode}
              className="p-1 text-black"
            />
            <button className="bg-white text-black px-2 py-1 rounded" onClick={joinRoom}>
              CONNECT
            </button>
            <button className="bg-white text-black px-2 py-1 rounded" onClick={handleStartVideoChat}>
              START VIDEO CHAT
            </button>
          </div>
        </div>
        <div className='flex gap-20'>
          <CodeEditor code={code} onChange={handleChange} />
          <div className="flex flex-col gap-10">
            <div className="w-52">
              <h2 className="text-white text-center font-bold text-2xl mb-2">Local Video</h2>
              <video ref={localVideoRef} autoPlay playsInline className="w-full"></video>
            </div>
            <div className="w-52">
              <h2 className="text-white font-bold text-center text-2xl mb-2">Remote Video</h2>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full"></video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeShare;
