import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';
import { api } from '../../services/api'
import { useEffect, useState } from 'react';
import io from 'socket.io-client'


type MessageProps = {
    id: string;
    text:string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messagesQueue:MessageProps[] = [];

const socket = io('http://localhost:4000')
socket.on("New_message", (newMessage:MessageProps) => {
    messagesQueue.push(newMessage);
})

export function MessageList(){
    const [messages, setMessage] = useState<MessageProps[]>([]);
    useEffect(() =>{
        setInterval(() =>{
            if(messagesQueue.length > 0){
                setMessage(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))
                messagesQueue.shift();
            }
        }, 3000)
    })
    useEffect(()=>{
        api.get<MessageProps[]>('messages/last3').then(response => 
            setMessage(response.data))
    },[])
    return(
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt='DoWhile 2021' />
            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                    <li className={styles.message} key={message.id}>
                        <p>{message.text}</p>  
                         <div className={styles.messageUser}>
                             <div className={styles.userImage}>
                                 <img src={message.user.avatar_url} alt="Matheus Gomes"/>
                             </div>
                             <span>{message.user.name}</span>
                         </div>
                     </li>);
                })}
            </ul>
        </div>
    )
}