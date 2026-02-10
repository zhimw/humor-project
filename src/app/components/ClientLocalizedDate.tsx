'use client';

import { useEffect, useState } from 'react';

type ClientLocalizedDateProps = {
  dateString: string | null;
};

export default function ClientLocalizedDate({ dateString }: ClientLocalizedDateProps) {
  const [localizedDate, setLocalizedDate] = useState<string>('—');

  useEffect(() => {
    if (dateString) {
      setLocalizedDate(new Date(dateString).toLocaleString());
    } else {
      setLocalizedDate('N/A');
    }
  }, [dateString]);

  return <span suppressHydrationWarning>{localizedDate}</span>;
}
