'use client';

import { useEffect, useState } from 'react';
import ExpandableText from './ExpandableText';
import ClientLocalizedDate from './ClientLocalizedDate';

type CaptionExample = {
  id: number;
  created_datetime_utc: string;
  modified_datetime_utc: string | null;
  image_description: string;
  caption: string;
  explanation: string;
  priority: number;
  image_id: string | null;
};

type CaptionExamplesTableProps = {
  initialData: CaptionExample[];
};

export default function CaptionExamplesTable({ initialData }: CaptionExamplesTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading table...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Created At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Modified At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Image Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Caption
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Explanation
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Image ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-black dark:divide-gray-700">
          {initialData.map((example) => (
            <tr key={example.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{example.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <ClientLocalizedDate dateString={example.created_datetime_utc} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <ClientLocalizedDate dateString={example.modified_datetime_utc} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                <ExpandableText text={example.image_description} maxLength={50} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                <ExpandableText text={example.caption} maxLength={50} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                <ExpandableText text={example.explanation} maxLength={50} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{example.priority}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{example.image_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
