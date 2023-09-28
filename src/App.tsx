import React from 'react';
import { useDropzone } from 'react-dropzone';
import { convertPdfFileToImages } from './utils/converter';
import { usePreviewModal } from './hooks/usePreviewModal';
import PreviewModal from './components/PreviewModal';
import { Document } from './model';

const App = () => {
    const [documents, setDocuments] = React.useState<Array<Document>>([]);
    const [filesInError, setFilesInError] = React.useState<Array<string>>([]);
    const { show, getPreviewModalProps } = usePreviewModal();

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
        <main className="mx-auto max-w-7xl px-5 font-sans">
            <h1 className="my-20 text-center text-5xl font-bold text-blue-800">PDF to Images</h1>
            <div
                {...getRootProps()}
                className="mx-auto mb-20 max-w-lg cursor-pointer rounded-2xl border border-dashed border-gray-300 p-12"
            >
                <label htmlFor="pdf-files" className="flex cursor-pointer justify-center text-xl font-bold text-black">
                    Drag and drop some PDF files or&nbsp;<span className="text-blue-800">browse</span>
                </label>
                <input id="pdf-files" {...getInputProps()} />
            </div>
            {filesInError.length > 0 && (
                <p
                    role="alert"
                    className="mb-6 w-fit rounded-lg border border-solid border-red-800 bg-red-50 p-2 text-red-800"
                >{`Cannot convert ${filesInError.join(',')}`}</p>
            )}
            <div className="flex flex-col gap-20 pb-20">
                {documents.map((document, index) => (
                    <section key={index}>
                        <h2 className="mb-6 text-xl font-semibold text-black">{document.name}</h2>
                        <div className="grid grid-cols-[repeat(auto-fill,_400px)] gap-5">
                            {document.pagesAsImageData.map((image, index) => {
                                const description = `File ${document.name} - Page ${index + 1}`;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => show({ description, dataUrl: image })}
                                        className="cursor-pointer"
                                    >
                                        <img src={image} className="block shadow-md" alt={description} />
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
            <PreviewModal {...getPreviewModalProps()} />
        </main>
    );
};

export default App;
