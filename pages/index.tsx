import dynamic from 'next/dynamic';

const DicomViewer = dynamic(() => import('../components/DicomViwer'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold p-4">DICOM Viewer with Metadata</h1>
      <DicomViewer />
    </div>
  );
}
