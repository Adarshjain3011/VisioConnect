import React, { useEffect, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';

import ReactPlayer from "react-player";

const Room = () => {

    const { socket } = useSocket();

    const { peer, createOffer,createAnswer,setRemoteAns,sendStream,remoteStream } = usePeer();

    const [myStream,setMyStream] = useState(null);

    const [reomteEmailId,setRemoteEmailId] = useState(null);



    const handleNewUserJoined = async(data)=>{

        const { emailId } = data;
        
        console.log("a new user joinded ",emailId);

        const offer = await createOffer();

        socket.emit("call-user",{ emailId,offer});

        setRemoteEmailId(emailId);
        sendStream(myStream); // share your stream with the newly joined user

        
    }


    async function handleIncommingCall(data){


        try{

            
            const {from,offer} = data;
            
            console.log("Incomming call handle ke andar  ",offer);

            console.log("incomming call from ",from,offer);


            const ans = await createAnswer(offer);

            socket.emit("call-accepted",{from,ans});

            // socket.emit("call-accepted",{from,ans});


        }catch(e){

            console.log(e);
        }
    }





    async function handleCallAccepted(data){

        const {ans} = data;  // now use this answer and set it into our local description 

        console.log("call got accepted ",ans);

        await setRemoteAns(ans);

         sendStream(myStream); // when call is accepted then we send our stream 

    }



    async function getUserMediaStream(){

        const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:true });

        setMyStream(stream);

    }


    async function handleNegociation(){

        const localOffer = peer.localDescription;

        socket.emit("call-user",{emailId:reomteEmailId,offer:localOffer});


    }



    useEffect(()=>{

        peer.addEventListener('negotiationneeded',handleNegociation);

        return ()=>{

            peer.removeEventListener('negotiationneeded',handleNegociation);

        }

    },[])


    useEffect(() => {

        console.log("user joined event ke andar ");

 
            socket.on('user-joined',handleNewUserJoined); 

            socket.on('incomming-call',handleIncommingCall);

            socket.on("call-accept",handleCallAccepted);


        return () => {


            // Clean up the socket listener when component unmounts

            if (socket) {

                socket.off('user-joined',handleNewUserJoined);

                socket.off("incomming-call",handleIncommingCall);

                socket.off("call-accept",handleCallAccepted);
            }
        };


    }, [socket]);


    useEffect(()=>{


        getUserMediaStream();

    },[getUserMediaStream])

    return (


        <div>

            <p>Hello, join room ke andar!</p>

            <h4>you are connected to {reomteEmailId}</h4>

            <button onClick={(e)=>sendStream(myStream)} className='border'>Send my video </button>

            <ReactPlayer url={myStream} playing muted></ReactPlayer>

            <ReactPlayer url={remoteStream} playing ></ReactPlayer>

        </div>
    );
};

export default Room;






