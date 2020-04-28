import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function CustomUpload({ current, save }) {
    const [customImage, setCustomImage] = useState(current);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
            setCustomImage(reader.result);
            save(reader.result);
        };
        reader.readAsDataURL(file);
    }, [setCustomImage]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            {/*{customImage && <img src={customImage} alt="Custom" />}*/}
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop Here!</p> :
                    <p>Drag 'n' drop a custom picture here, or click to select files</p>
            }
        </div>
    )
}