import { useState, useEffect } from 'react';

const useScroll = (ref) => {
  const currentRef = ref?.current;
  const [isScroll, setIsScroll] = useState(false);
  const [scrollHeightPre, setScrollHeightPre] = useState();

  const handleScroll = () => setIsScroll(isBottom() ? true : false);

  useEffect(() => {
    if (ref) {
      currentRef?.addEventListener('scroll', handleScroll);
      return () => {
        currentRef?.removeEventListener('scroll', handleScroll);
      };
    }
  });

  const isBottom = () => {
    if (!currentRef) return false;
    const { scrollTop, scrollHeight, clientHeight } = currentRef;
    if (scrollHeight - (scrollTop + clientHeight) <= 50 && scrollHeight !== scrollHeightPre) {
      setScrollHeightPre(scrollHeight);
      return true;
    }
    return false;
  };

  return [isScroll, setIsScroll];
};
export default useScroll;
