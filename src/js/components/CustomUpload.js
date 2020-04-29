import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPT_TYPES = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/svg+xml'
];

export default function CustomUpload({ save }) {
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (!ACCEPT_TYPES.includes(file.type)) {
            console.log('invalid file type', file.type);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => save(reader.result);
        reader.readAsDataURL(file);
    }, [save]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop Here!</p> :
                    <p>Drag 'n' drop a custom picture here, or click to browse for a file</p>
            }
        </div>
    )
}