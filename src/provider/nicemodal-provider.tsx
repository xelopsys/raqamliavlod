'use client';

import NiceModal from '@ebay/nice-modal-react';

export default function NiceModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NiceModal.Provider>{children}</NiceModal.Provider>;
}
