'use client';

import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

// Setup external dependencies
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

export default function DicomViewer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      cornerstone.enable(elementRef.current);
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

    try {
      const image = await cornerstone.loadAndCacheImage(imageId);
      if (elementRef.current) {
        cornerstone.displayImage(elementRef.current, image);
      }
    } catch (err) {
      console.error('Failed to load and display DICOM image:', err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".dcm"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="mb-4 border p-2 rounded"
      />
      <div
        ref={elementRef}
        style={{
          width: '512px',
          height: '512px',
          backgroundColor: 'black',
        }}
      />
    </div>
  );
}
