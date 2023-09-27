import React from 'react';
import { useDropzone } from 'react-dropzone';
import { convertPdfFileToImages } from './utils/converter';
import { usePreviewModal } from './hooks/usePreviewModal';
import PreviewModal from './components/PreviewModal';

type Document = {
    name: string;
    pagesAsImageData: Array<string>;
};

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
        <main className="max-w-7xl mx-auto px-5 font-sans">
            <h1 className="text-blue-800 text-5xl font-bold my-20 text-center">PDF to Images</h1>
            <div
                {...getRootProps()}
                className="border-gray-300 border border-dashed rounded-2xl p-12 max-w-lg mx-auto mb-20"
            >
                <label htmlFor="pdf-files" className="text-xl font-bold text-black flex justify-center">
                    Drag and drop some PDF files or&nbsp;<span className="text-blue-800">browse</span>
                </label>
                <input id="pdf-files" {...getInputProps()} />
            </div>
            {filesInError.length > 0 && <p role="alert">{`Cannot convert ${filesInError.join(',')}`}</p>}
            <div className="flex flex-col gap-20 pb-20">
                {documents.map((document, index) => (
                    <section key={index}>
                        <h2 className="text-xl font-semibold text-black mb-6">{document.name}</h2>
                        <div className="grid grid-cols-[repeat(auto-fill,_400px)] gap-5">
                            {document.pagesAsImageData.map((image, index) => (
                                <button onClick={() => show(image)} className="cursor-pointer">
                                    <img
                                        key={index}
                                        src={image}
                                        className="block shadow-md"
                                        alt={`File ${document.name} - Page ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <PreviewModal {...getPreviewModalProps()} />
        </main>
    );
};

export default App;
