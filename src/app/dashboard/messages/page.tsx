"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default function MessagesPage() {
    const [activeId, setActiveId] = useState(1);
    const [message, setMessage] = useState('');

    const conversations = [
        { id: 1, name: 'Sarah Johnson', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', time: '2m', preview: 'Can we reschedule for tomorrow?' },
        { id: 2, name: 'Michael Chen', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', time: '1h', preview: 'Thanks for the update!' },
        { id: 3, name: 'Emily Davis', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', time: '1d', preview: 'The kids had a great time.' },
    ];

    const messages = [
        { id: 1, text: 'Hi Sarah, are you available this weekend?', sender: 'me' },
        { id: 2, text: 'Yes, I am free on Saturday afternoon.', sender: 'them' },
        { id: 3, text: 'Great! Can we reschedule for tomorrow instead?', sender: 'them' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.conversationList}>
                <div className={styles.listHeader}>
                    <input type="text" placeholder="Search messages..." className={styles.search} />
                </div>
                <div className={styles.conversations}>
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`${styles.conversationItem} ${activeId === conv.id ? styles.active : ''}`}
                            onClick={() => setActiveId(conv.id)}
                        >
                            <Image src={conv.image} alt={conv.name} width={40} height={40} className={styles.avatar} />
                            <div className={styles.conversationInfo}>
                                <div className={styles.nameRow}>
                                    <span className={styles.name}>{conv.name}</span>
                                    <span className={styles.time}>{conv.time}</span>
                                </div>
                                <p className={styles.preview}>{conv.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                    <Image
                        src={conversations.find(c => c.id === activeId)?.image || ''}
                        alt="Active User"
                        width={40}
                        height={40}
                        className={styles.avatar}
                    />
                    <span className={styles.chatName}>{conversations.find(c => c.id === activeId)?.name}</span>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.message} ${msg.sender === 'me' ? styles.messageSent : styles.messageReceived}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className={styles.messageInput}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="icon" size="md">
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
