'use client';

import { useState } from 'react';

type ExpandableTextProps = {
  text: string;
  maxLength?: number;
};

export default function ExpandableText({ text, maxLength = 100 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <span>
      {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      <button onClick={toggleExpanded} className="text-blue-500 hover:underline ml-2">
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  );
}
