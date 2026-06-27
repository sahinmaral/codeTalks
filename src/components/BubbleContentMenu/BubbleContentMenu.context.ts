import React, { createContext, useContext } from 'react';

interface BubbleContentMenuContextValue {
  scrollTo: (y: number) => void;
  setSheetHeight: (height: number | null) => void;
  setFooter: (footer: React.ReactNode) => void;
}

export const BubbleContentMenuContext = createContext<BubbleContentMenuContextValue>({
  scrollTo: () => {},
  setSheetHeight: () => {},
  setFooter: () => {},
});

export const useBubbleContentMenuScroll = () => useContext(BubbleContentMenuContext);
