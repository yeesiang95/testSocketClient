import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io('http://localhost:8080');

function App() {

    const [ list, setList] = useState([]);
    const [ message, setMessage] = useState('');
    const [ room , setRoom] = useState('');


    useEffect(()=>{
        setList([]);
    },[])

    useEffect(()=>{
        socket.on('connect',()=>{
            setList(prev =>[...prev,{msg:socket.id}])
        })

        socket.on('receive-message',message=>{
            console.log(message);
            setList(prev=>[...prev,{msg:message}]);
        })
        return ()=>{
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        }
    },[])

    const onSend=()=>{
        socket.emit('send-message',message,room);
        setList(prev =>[...prev,{msg:message}])
        setMessage('');
    }

    const joinRoom = ()=>{
        socket.emit('join-room',room,message=>{
            setList(prev =>[...prev,{msg:message}])
        });
    }

    return (
        <div className="App">
            <ul>
            {list.map((item)=>{
                return <li key={item.msg}>{item.msg}</li>
            })}
            </ul>
            <input value={message} onChange={(e)=>setMessage(e.target.value)} />
            
            <button onClick={onSend}>Send</button>
            <input value={room} onChange={(e)=>setRoom(e.target.value)} />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
}

export default App;
