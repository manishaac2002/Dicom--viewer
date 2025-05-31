'use client'; // Ensure this if you use browser-only features

import dynamic from 'next/dynamic';

const DicomViewer = dynamic(() => import('./components/DicomViwer'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className='p-4'>
      <DicomViewer />
    </div>
  );
}
