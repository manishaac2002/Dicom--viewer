'use client'; // Ensure this if you use browser-only features

import dynamic from 'next/dynamic';

const DicomViewer = dynamic(() => import('./components/DicomViewer'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className='p-4'>
      <h1 className="text-amber-700 font-bold text-2xl">DICOM VIEWER</h1>
      <DicomViewer />
    </div>
  );
}
