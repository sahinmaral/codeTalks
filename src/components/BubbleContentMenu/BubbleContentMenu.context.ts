import { createContext, useContext } from 'react';

interface BubbleContentMenuContextValue {
  scrollTo: (y: number) => void;
}

export const BubbleContentMenuContext = createContext<BubbleContentMenuContextValue>({
  scrollTo: () => {},
});

export const useBubbleContentMenuScroll = () => useContext(BubbleContentMenuContext);
