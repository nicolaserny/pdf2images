import React from 'react';
import { useDropzone } from 'react-dropzone';
import { convertPdfFileToImages } from './utils/converter';

type Document = {
    name: string;
    pagesAsImageData: Array<string>;
};

const App = () => {
    const [documents, setDocuments] = React.useState<Array<Document>>([]);
    const [filesInError, setFilesInError] = React.useState<Array<string>>([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        onDrop: async (acceptedFiles) => {
            setFilesInError([]);
            setDocuments([]);
            acceptedFiles.forEach(async (file) => {
                try {
                    const fileName = file.name;
                    await convertPdfFileToImages(file, (imageData) => {
                        setDocuments((prevDocuments) => {
                            const documentIndex = prevDocuments.findIndex((document) => document.name === fileName);
                            if (documentIndex === -1) {
                                return [
                                    ...prevDocuments,
                                    {
                                        name: fileName,
                                        pagesAsImageData: [imageData],
                                    },
                                ];
                            } else {
                                const currentDocument = prevDocuments[documentIndex];
                                const updatedDocuments = [
                                    ...prevDocuments.slice(0, documentIndex),
                                    {
                                        ...currentDocument,
                                        pagesAsImageData: [...currentDocument.pagesAsImageData, imageData],
                                    },
                                    ...prevDocuments.slice(documentIndex + 1),
                                ];
                                return updatedDocuments;
                            }
                        });
                    });
                } catch (error) {
                    setFilesInError((prevFilesInError) => [...prevFilesInError, file.name]);
                }
            });
        },
    });

    return (
        <main>
            <h1>PDF to Images</h1>
            <div {...getRootProps()} style={{ border: '1px solid black', padding: '20px' }}>
                <label htmlFor="pdf-files">Drag and drop some PDF files or browse</label>
                <input id="pdf-files" {...getInputProps()} />
            </div>
            {filesInError.length > 0 && <p role="alert">{`Cannot convert ${filesInError.join(',')}`}</p>}
            {documents.map((document, index) => (
                <section key={index}>
                    <h2>{document.name}</h2>
                    <div>
                        {document.pagesAsImageData.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                width={300}
                                alt={`File ${document.name} - Page ${index + 1}`}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
};

export default App;
