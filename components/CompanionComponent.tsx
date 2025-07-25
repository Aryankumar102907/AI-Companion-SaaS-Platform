"use client";

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import soundwaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
  INACTIVE= 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE='ACTIVE',
  FINISHED = 'FINISHED',
}

interface CompanionComponentProps {
  companionId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  style: string;
  voice: string;
  duration: number;
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice, duration }: CompanionComponentProps) => {

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([])

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (callStatus === CallStatus.ACTIVE) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE) {
      setElapsedTime(0);
    }

    return () => clearInterval(timer);
  }, [callStatus]);

  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE && elapsedTime >= duration * 60) {
      handleDisconnect();
    }
  }, [elapsedTime, duration, callStatus]);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play()
      } else {
        lottieRef.current?.stop()
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      addToSessionHistory(companionId);
    }

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript }

        setMessages((prev) => [newMessage, ...prev])
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.log('Error', error);
      setCallStatus(CallStatus.FINISHED);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    // Clean off states
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
    }
  }, []); // Empty dependency array we only load at the start

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  }

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)

    const assistantOverrides = {
      variableValues: {
        subject, topic, style
      },
      clientMessages: ['transcript'],
      serverMessages: [],
    }

    // @ts-expect-error because vapi.start typing doesn't allow override types

    vapi.start(configureAssistant(voice, style), assistantOverrides);
  }

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop();
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className='companion-section'>
          <div className='companion-avatar' style={{
            backgroundColor: getSubjectColor(subject)
          }}>
            <div className={
              cn
                (
                  "absolute transition-opacity duration-1000",
                  callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                  callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                )
            }>
              <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className='max-sm:w-fit' />
            </div>
            <div className={
              cn
                (
                  "absolute transition-opacity duration-1000",
                  callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                )
            }>
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className='companion-lottie'
              />
            </div>
          </div>
          <p className='font-bold text-2xl'>{name}</p>
        </div>

        <div className='user-section'>
          <div className='user-avatar'>
            <Image src={userImage} alt={userName} width={130} height={130} className='rounded-lg' />
            <p className='font-bold text-2xl'>
              {userName}
            </p>
            <p className="text-lg font-semibold mt-2">{formatTime(elapsedTime)}</p>
          </div>
          <button
            className='btn-mic'
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt='mic' width={36} height={36} />
            <p className='max-sm:hidden'>
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button className={
            cn
              (
                "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
                callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                callStatus === CallStatus.CONNECTING && 'animate-pulse'
              )
          } onClick={
            callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
          }>
            {
              callStatus === CallStatus.ACTIVE
                ? "End Session"
                : callStatus === CallStatus.CONNECTING
                  ? "Connecting"
                  : "Start Session"
            }
          </button>
        </div>
      </section>

      <section className='transcript'>
        <div className='transcript-message no-scrollbar'>
          {messages.map((message, index) => {
            if (message.role === 'assistant') {
              return (
                <p key={index} className='max-sm:text-sm'>
                  {
                    name
                      .split(' ')[0]
                      .replace(/[.,]/g, ', ')
                  }: {message.content}
                </p>
              )
            } else {
              return <p key={index} className='text-primary max-sm:text-sm'>
                {userName}: {message.content}
              </p>
            }
          })}
        </div>

        <div className='transcript-fade' />
      </section>
    </section>
  )
}

export default CompanionComponent;