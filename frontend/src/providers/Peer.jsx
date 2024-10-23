import React, { createContext, useContext, useMemo, useState } from 'react';

import { useEffect } from 'react';

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = (props) => {


    const [remoteStream,setReomteStream] = useState(null);

    const peer = useMemo(() => new RTCPeerConnection({

        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ]
    }), []);
    

    const createOffer = async () => {

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;


    };

    const sendStream = (stream) => {
    
        if (stream && peer && !peer.getSenders().find(sender => sender.track && sender.track.kind === stream.kind)) {
            peer.addStream(stream);
        }
    };

    const createAnswer = async (offer) => {

        await peer.setRemoteDescription(offer);  // ushki description maine yaad kar li  

        const answer = await peer.createAnswer(); // ushke basis pe maine ek answer create kiya 

        await peer.setLocalDescription(answer);  // khud ki state mai save karke ushko yaaad kar lunga 

        return answer;

    }



    const setRemoteAns = async (ans) => {

        await peer.setRemoteDescription(ans);  // ushki description maine yaad kar li

    }



    async function handleTrackEvent(ev){


        console.log("handle track event ke andar ");

        const streams = ev.streams;

        setReomteStream(streams[0]);

    }


    useEffect(()=>{

        peer.addEventListener('track',handleTrackEvent);


        return ()=>{

            peer.removeEventListener('track',handleTrackEvent);

        }

    },[peer,handleTrackEvent]);
    

    return (
        <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAns,sendStream,remoteStream }}>
            {props.children}
        </PeerContext.Provider>
    );
};




