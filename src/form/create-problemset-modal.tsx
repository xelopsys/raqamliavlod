'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Modal from '@/components/modal/modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { PencilIcon, UserIcon, TagIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { convertDate } from '@/helper';
import TextArea from '@/components/textarea/textarea';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@headlessui/react';

function CreateProblemTest(props: Record<string, any>) {
  const testsUrl = '/api/problemsets/tests';
  const modal = useModal();
  const queryClient = useQueryClient();
  const [input, setInput] = useState<string>('');
  const [isInput, setIsInput] = useState<number>(0);
  const [output, setOutput] = useState<string>('');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance(`${testsUrl}`, {
        data,
        method: 'POST',
      });
    },
    {
      onSuccess: () => {
        toast.success("Misol qo'shildi");
        modal.hide();
        queryClient.invalidateQueries();
      },
      onError: () => {
        toast.error('Xatolik');
      },
    }
  );

  const onSubmit = () => {
    mutation.mutate({
      input,
      output,
      problemsetid: props?.id,
    });
  };

  const handleInput = (text: string) => {
    setInput(text);
  };
  const handleOutput = (text: string) => {
    setOutput(text);
  };

  return (
    <Modal modal={modal}>
      <div className='w-full h-full flex flex-col justify-start items-start gap-3 px-5 py-10'>
        <div className='w-full  flex flex-col justify-start items-start gap-3'>
          <ArrowLeftIcon
            width={20}
            onClick={() => {
              setIsInput(0);
            }}
          />
          <h1 className='w-full text-left text-base md:text-lg lg:text-lg'>
            {isInput === 0 ? 'Input' : 'Output'}ni kiriting
          </h1>
          <div className='w-full h-max flex gap-3 border'>
            <TextArea
              handleSubmitText={(text) => {
                if (isInput === 0) handleInput(text);
                else handleOutput(text);
              }}
            />
          </div>
          {/* <section className='w-full flex flex-row justify-start items-center gap-2'>
            <p className='text-base'>Input</p>
            <Switch
              checked={isInput}
              onChange={setIsInput}
              className={`${
                isInput ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-12 items-center rounded-full`}>
              <span className='sr-only'>Enable Input</span>
              <span
                className={`${
                  isInput ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <p className='text-base'>Output</p>
          </section> */}
          <button
            type='button'
            disabled={
              (input === '' && isInput === 0) ||
              (output === '' && isInput === 1)
            }
            onClick={() => {
              if (isInput === 0) setIsInput(1);
              else onSubmit();
            }}
            className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center disabled:opacity-20 disabled:cursor-not-allowed z-30'>
            {isInput === 0 ? 'Outputni kiriting' : 'Yaratish'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NiceModal.create(CreateProblemTest);
