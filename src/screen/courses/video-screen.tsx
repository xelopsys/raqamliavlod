'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/24/solid';
import {
  ClockIcon,
  EyeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import { getToutubeVideoUrl, getHoursFromSeconds } from '@/helper';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';

export default function VideoComponent({
  video,
}: {
  video: Record<string, any>;
}) {
  const apiUrl = '/api/userwatchedvideo';
  const videoRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const timeMutation = useMutation((data: Record<string, any>) => {
    return axiosinstance(apiUrl, {
      data,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });

  useEffect(() => {
    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-big-play-centered');
    videoRef.current && videoRef.current.appendChild(videoElement);

    const options = {
      techOrder: ['youtube'], // Use the YouTube tech for playback
      sources: [
        // Add the YouTube video URL as the source
        {
          type: 'video/youtube',
          src: video?.url,
        },
      ],
      controls: true,
      autoplay: false,
      loop: false,
      fluid: true,
      playable: true,
      // aspectRatio: '16:9',

      // playlist: [{ src: video?.url },], // Add more videos to create a playlist
    };

    const player = videojs(videoElement, options, () => {
      player.on('ended', () => {
        timeMutation.mutate({
          VideoId: video?.id,
          CourseId: Number(id),
          Time: Math.ceil(+player.currentTime().toFixed(2)),
        });
      });
      player.on('pause', () => {
        timeMutation.mutate({
          VideoId: video?.id,
          CourseId: Number(id),
          Time: Math.ceil(+player.currentTime().toFixed(2)),
        });
      });
      player.on('play', () => {
        timeMutation.mutate({
          VideoId: video?.id,
          CourseId: Number(id),
          Time: Math.ceil(+player.currentTime().toFixed(2)),
        });
      });

      player.on('durationchange', () => {
        timeMutation.mutate({
          VideoId: video?.id,
          CourseId: Number(id),
          Time: Math.ceil(+player.currentTime().toFixed(2)),
        });
      });
    });

    return () => {
      player.dispose();
    };
  }, [video]);

  return (
    <div className='w-full h-max flex flex-col justify-start items-start rounded-lg bg-white'>
      {/* {showVideo ? (

      ) : (
        <div className='w-full h-max rounded-lg relative'>
          <Image
            width={500}
            height={500}
            quality={100}
            alt='thumbnail'
            src={video?.thumbnail}
            className='w-full h-full object-cover rounded-lg'
          />
          <button
            type='button'
            onClick={() => setShowVideo(!showVideo)}
            className='absolute z-30 p-5 border top-[35%] md:top-[40%] lg:top-[45%] left-[40%] md:left-[43%] lg:left-[45%] rounded-full bg-blue-light'>
            <PlayIcon
              width={20}
              className='text-blue-500'
            />
          </button>
        </div>
      )} */}

      <div className='w-full h-max p-2'>
        {/* <iframe
            width={600}
            height={500}
            src={`https://www.youtube.com/embed/${getToutubeVideoUrl(
              video?.url
            )}`}
            title={video?.title}
            className='w-full h-full rounded-lg'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen></iframe> */}
        <div data-vjs-player>
          <div ref={videoRef} />
        </div>
      </div>
    </div>
  );
}
