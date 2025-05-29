'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

export default function DicomViewer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [metaDataList, setMetaDataList] = useState<{ tag: string; value: string }[]>([]);

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

      // Manually read file to extract metadata
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const arrayBuffer = e.target?.result;
          if (!arrayBuffer || typeof arrayBuffer === 'string') {
            console.error('Invalid arrayBuffer');
            return;
          }

          const byteArray = new Uint8Array(arrayBuffer);
          const dataSet = dicomParser.parseDicom(byteArray);

          const elements = dataSet.elements;
          const metaList: { tag: string; value: string }[] = [];

          for (const tag in elements) {
            try {
              const value = dataSet.string(tag);
              if (value) {
                metaList.push({
                  tag: tag.toUpperCase(),
                  value,
                });
              }
            } catch (err) {
              // skip non-string values
            }
          }

          if (metaList.length === 0) {
            console.warn('No readable metadata found.');
          }

          setMetaDataList(metaList);
        } catch (err) {
          console.error('Failed to parse DICOM metadata', err);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Failed to load image', err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".dcm"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div
        ref={elementRef}
        style={{
          width: '512px',
          height: '512px',
          backgroundColor: 'black',
          marginTop: '20px',
        }}
      />
      <div className="mt-4 text-gray-800">
        <h2 className="text-lg font-semibold">All DICOM Metadata</h2>
        {metaDataList.length === 0 ? (
          <p>No metadata available</p>
        ) : (
          <ul className="text-sm max-h-80 overflow-auto border p-2 rounded bg-white shadow">
            {metaDataList.map((item, index) => (
              <li key={index}>
                <strong>{item.tag}</strong>: {item.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
