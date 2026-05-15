import React, { useCallback, useRef } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './BubbleContentMenu.styles';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Button from '../Button';
import { BubbleContentMenuContext } from './BubbleContentMenu.context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BubbleContentMenuProps {
  children: React.ReactNode;
  onClose: () => void;
}

function BubbleContentMenu({ children, onClose }: BubbleContentMenuProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { bottom } = useSafeAreaInsets();

  const scrollTo = useCallback((y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  return (
    <BubbleContentMenuContext.Provider value={{ scrollTo }}>
      <BottomSheet
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        enableDynamicSizing
        maxDynamicContentSize={SCREEN_HEIGHT * 0.85}
        ref={bottomSheetRef}
        style={styles.container}
        bottomInset={bottom}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView ref={scrollViewRef}>
          <View style={styles.contentContainer}>{children}</View>

          <View style={styles.buttonsContainer}>
            <Button
              title="Cancel"
              theme="primary-outline"
              onPress={() => {
                onClose?.();
              }}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </BubbleContentMenuContext.Provider>
  );
}

export default BubbleContentMenu;
