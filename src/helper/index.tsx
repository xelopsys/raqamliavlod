import { TObject } from '@/types';
import { toast } from 'react-hot-toast';
import { LinkIcon } from '@heroicons/react/24/outline';

const wait = (secs: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, secs * 1000);
  });
};

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const ObjectToFormData = (object: any) => {
  const formData = new FormData();

  for (const key in object) {
    if (Array.isArray(object[key])) {
      formData.append(key, object[key]);
    } else {
      formData.append(key, object[key]);
    }
  }

  return formData;
};

const compareDateAndGetLastSeen = (date: string) => {
  const now = new Date();
  const lastSeen = new Date(date);

  const diff = now.getTime() - lastSeen.getTime();
  const diffInDays = diff / (1000 * 3600 * 24);

  if (diffInDays > 365) {
    return `${Math.floor(diffInDays / 365)} yil oldin`;
  } else if (diffInDays > 30) {
    return `${Math.floor(diffInDays / 30)} oy oldin`;
  } else if (diffInDays > 7) {
    return `${Math.floor(diffInDays / 7)} hafta oldin`;
  } else if (diffInDays > 1) {
    return `${Math.floor(diffInDays)} kun oldin`;
  } else if (diffInDays > 0) {
    return `Bugun`;
  } else {
    return `${Math.floor(diffInDays)} kun oldin`;
  }
};

const calculatePercent = (full: number, part: number) => {
  return (part * 100) / full;
};

const getToutubeVideoUrl = (url: string) => {
  const videoId = url?.split('v=')[1];
  const ampersandPosition = videoId?.indexOf('&');
  if (ampersandPosition !== -1) {
    return videoId?.substring(0, ampersandPosition);
  }
  return videoId;
};

const getHoursFromMins = (mins: number) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours} soat ${minutes} daqiqa`;
};

const getHoursFromSeconds = (seconds: number) => {
  const hours = Math.trunc(seconds / 3600);
  const minutes = Math.trunc((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${hours} soat ${minutes} daqiqa ${sec} soniya`;
};

const translateWeekDays = (weekday: string) => {
  switch (weekday) {
    case 'Sunday': {
      return 'Yakshanba';
    }
    case 'Monday': {
      return 'Dushanba';
    }
    case 'Tuesday': {
      return 'Seshanba';
    }
    case 'Wednesday': {
      return 'Chorshanba';
    }
    case 'Thursday': {
      return 'Payshanba';
    }
    case 'Friday': {
      return 'Juma';
    }
    case 'Saturday': {
      return 'Shanba';
    }
  }
};

const handleCopy = async (id: number) => {
  await navigator.clipboard
    .writeText(`https://${window.location.host}/blog/post?id=${id}`)
    .then(() => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-1/2 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 px-4 py-3`}>
          <div className='text-lg font-semibold w-full h-max flex flex-row justify-start items-center gap-x-3'>
            <LinkIcon width={20} />
            <span className='underline decoration-blue-500'>
              Havola nusxalandi!
            </span>
          </div>
        </div>
      ));
    });
};

const downloadFile = async (data: any, fileName: string) => {
  const urlCopy = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = urlCopy;
  link.setAttribute('download', `${fileName}.png`);
  document.body.append(link);
  link.click();
  link.remove();
};

const downloadUrl = async (url: string, fileName: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.png`); // Specify the desired file name with extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error('Error downloading image:', error);
    });
};
const unformatPhoneNumber = (phone: string | undefined) => {
  let result;
  if (phone) {
    result = `${phone
      .replaceAll('-', '')
      .replace('(', '')
      .replace('+', '')
      .replace(')', '')
      .replaceAll(' ', '')}`;
  } else {
    return '';
  }
  return result;
};

const convertDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const stringMonth = month < 10 ? `0${month}` : month;
  const stringDay = day < 10 ? `0${day}` : day;
  const stringHour = hour < 10 ? `0${hour}` : hour;
  const stringMinute = minute < 10 ? `0${minute}` : minute;
  const stringSecond = second < 10 ? `0${second}` : second;
  return `${year}-${stringMonth}-${stringDay} ${stringHour}:${stringMinute}:${stringSecond}`;
};

export {
  wait,
  classNames,
  ObjectToFormData,
  compareDateAndGetLastSeen,
  calculatePercent,
  getToutubeVideoUrl,
  getHoursFromMins,
  getHoursFromSeconds,
  translateWeekDays,
  handleCopy,
  downloadFile,
  downloadUrl,
  unformatPhoneNumber,
  convertDate,
};
