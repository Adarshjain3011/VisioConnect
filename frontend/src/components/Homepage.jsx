import React, { useEffect, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { useNavigate } from "react-router-dom";

const Homepage = () => {


    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');
    const { socket } = useSocket();
    const navigate = useNavigate();

    const clickHandler = () => {

        console.log(email, roomId);

        if (socket) {

            socket.emit('join-room', { roomId, emailId: email }, (ack) => {

                if (ack.success) {
                    console.log('Joined room successfully');
                } else {
                    console.error('Failed to join room:', ack.error);
                }
            });

        } else {
            
            console.error('Socket connection not available.');
        }
    };



    useEffect(() => {

        if (socket) {

            console.log('Socket connected successfully');

            socket.on('joined-room', (data) => {

                // console.log("user-joined event received",data);


                console.log("data is ".data);

                console.log("room id is ",data.roomId);

                console.log("email id is ",data.emailId);


                navigate(`/room/${data.roomId}`);


            });

            socket.on('connect_error', (error) => {

                console.error('Socket connection error:', error);

            });


        } else {

            console.error('Socket connection not available.');

        }

        return ()=>{

            socket.off('joined-room');


        }

    }, [socket]);


    return (
        <div className='flex justify-center items-center bg-amber-600 min-h-screen'>

            <div className='flex flex-col gap-3 w-[500px] '>

                <input type="text" placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} className='p-3 pl-3' />
                <input type="text" placeholder='Enter Your Room ID' onChange={(e)=>setRoomId(e.target.value)} className='p-3 pl-3'/>
                <button onClick={clickHandler} className='bg-green-700 inline-block p-3 text-white font-bold'>Enter the Room</button>

            </div>

        </div>
    );
};

export default Homepage;
