import React, { createContext, useCallback, useContext, useState } from 'react';
import BubbleContentMenu from './BubbleContentMenu';

interface BubbleContentMenuManagerContextValue {
  show: (content: React.ReactNode) => void;
  hide: () => void;
  visible: boolean;
}

const BubbleContentMenuManagerContext = createContext<BubbleContentMenuManagerContextValue>({
  show: () => {},
  hide: () => {},
  visible: false,
});

export function useBubbleContentMenu() {
  return useContext(BubbleContentMenuManagerContext);
}

interface BubbleContentMenuProviderProps {
  children: React.ReactNode;
}

export function BubbleContentMenuProvider({ children }: BubbleContentMenuProviderProps) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((newContent: React.ReactNode) => {
    setContent(newContent);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setContent(null);
  }, []);

  return (
    <BubbleContentMenuManagerContext.Provider value={{ show, hide, visible }}>
      {children}
      {visible && (
        <BubbleContentMenu onClose={hide}>{content}</BubbleContentMenu>
      )}
    </BubbleContentMenuManagerContext.Provider>
  );
}
