import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useCallback, ReactNode } from 'react';

import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';

type BottomSheetProps = {
  index?: number;
  snapPoints: (string | number)[];
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export function BottomSheet({
  index = -1,
  snapPoints,
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  const bottomSheetRef = useSheetRef();

  useEffect(() => {
    if (isOpen || index > -1) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen, index]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose]
  );

  return (
    <Sheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      enableDynamicSizing={false}>
      <BottomSheetView className="flex-1 items-center justify-center pb-8">
        {children}
      </BottomSheetView>
    </Sheet>
  );
}
