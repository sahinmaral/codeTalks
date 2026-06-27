import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyles from '@/hooks/useThemedStyles';
import Button from '../Button';
import { BubbleContentMenuContext } from './BubbleContentMenu.context';
import makeStyles from './BubbleContentMenu.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Space the drag handle occupies above the content, added on top of the
// measured scroll content + footer to derive the fixed sheet height.
const HANDLE_OFFSET = 28;

interface BubbleContentMenuProps {
  children: React.ReactNode;
  onClose: () => void;
}

function BubbleContentMenu({ children, onClose }: BubbleContentMenuProps) {
  const styles = useThemedStyles(makeStyles);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { bottom } = useSafeAreaInsets();
  const [sheetHeight, setSheetHeight] = useState<number | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [footer, setFooter] = useState<React.ReactNode>(null);

  const scrollTo = useCallback((y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  }, []);

  // When content requests a fixed height, size the sheet to the visible scroll
  // content + the (always-visible) footer, so the footer stays pinned while the
  // rest of the form scrolls underneath it.
  const snapPoints = useMemo(
    () => (sheetHeight ? [sheetHeight + footerHeight + HANDLE_OFFSET] : undefined),
    [sheetHeight, footerHeight],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const cancelButton = (
    <Button title="Cancel" theme="primary-outline" onPress={() => onClose?.()} />
  );

  return (
    <BubbleContentMenuContext.Provider value={{ scrollTo, setSheetHeight, setFooter }}>
      <BottomSheet
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableDynamicSizing={!snapPoints}
        snapPoints={snapPoints}
        maxDynamicContentSize={SCREEN_HEIGHT * 0.85}
        ref={bottomSheetRef}
        style={styles.container}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        bottomInset={bottom}
        backdropComponent={renderBackdrop}
        onClose={onClose}
      >
        {/*
          Keep the scroll view at a stable position so toggling `sheetHeight`
          never reparents `children` (which would remount the active content
          and lose its local state). Only its style and the sibling footer
          change between dynamic and fixed-height modes.
        */}
        <BottomSheetScrollView
          ref={scrollViewRef}
          style={sheetHeight ? styles.fixedContainer : undefined}
          contentContainerStyle={sheetHeight ? styles.scrollContent : undefined}
        >
          <View style={styles.contentContainer}>{children}</View>

          {!sheetHeight && <View style={styles.buttonsContainer}>{cancelButton}</View>}
        </BottomSheetScrollView>

        {sheetHeight ? (
          <View
            style={styles.footerContainer}
            onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
          >
            {footer}
            {cancelButton}
          </View>
        ) : null}
      </BottomSheet>
    </BubbleContentMenuContext.Provider>
  );
}

export default BubbleContentMenu;
