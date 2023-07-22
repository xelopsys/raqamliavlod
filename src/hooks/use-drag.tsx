import React, { useRef, useState } from 'react';

export default function useDrag({ sliderRef }: { sliderRef: any }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const handleDragStart = (event: React.DragEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current.children[0];
    const startX = event.pageX - slider.offsetLeft;
    const startY = event.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = 'grabbing';
  };
  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!sliderRef.current) return;
    document.body.style.cursor = 'default';
  };
  const handleDrag = (event: React.DragEvent | React.MouseEvent) => {
    if (!isMouseDown || !sliderRef.current) return;
    event.preventDefault();
    const slider = sliderRef.current.children[0];
    const x = event.pageX - slider.offsetLeft;
    const y = event.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    console.log(walkX, walkY);
  };

  return { handleDrag, handleDragEnd, handleDragStart };
}
