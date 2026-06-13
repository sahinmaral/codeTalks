import React, { createContext, useCallback, useContext, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { ConfirmationDialogTheme } from './ConfirmationDialog.styles';

export interface ConfirmationDialogOptions {
  title: string;
  description: string;
  icon: string;
  confirmTitle: string;
  cancelTitle?: string;
  theme?: ConfirmationDialogTheme;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmationDialogContextValue {
  confirm: (options: ConfirmationDialogOptions) => void;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextValue>({
  confirm: () => {},
});

export function useConfirmationDialog() {
  return useContext(ConfirmationDialogContext);
}

interface ConfirmationDialogProviderProps {
  children: React.ReactNode;
}

export function ConfirmationDialogProvider({ children }: ConfirmationDialogProviderProps) {
  const [options, setOptions] = useState<ConfirmationDialogOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = useCallback((nextOptions: ConfirmationDialogOptions) => {
    setOptions(nextOptions);
  }, []);

  const close = useCallback(() => {
    setOptions(null);
    setLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!options) return;

    try {
      setLoading(true);
      await options.onConfirm();
      close();
    } catch {
      setLoading(false);
    }
  }, [options, close]);

  const handleCancel = useCallback(() => {
    options?.onCancel?.();
    close();
  }, [options, close]);

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationDialog
        visible={options !== null}
        title={options?.title ?? ''}
        description={options?.description ?? ''}
        icon={options?.icon ?? ''}
        confirmTitle={options?.confirmTitle ?? ''}
        cancelTitle={options?.cancelTitle}
        theme={options?.theme}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationDialogContext.Provider>
  );
}
