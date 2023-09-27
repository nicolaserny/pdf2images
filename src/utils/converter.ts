import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { readFileContentAsBuffer } from './fileUtils';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('/workers/pdf.worker.js', import.meta.url).toString();

export async function convertPdfFileToImages(file: File, onImageConverted: (imageData: string) => void) {
    const arrayBuffer = await readFileContentAsBuffer(file);
    const buffer = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const canvas = document.createElement('canvas');
        try {
            const ctx = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 2 });
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = viewport.width * pixelRatio;
            canvas.height = viewport.height * pixelRatio;
            ctx?.scale(pixelRatio, pixelRatio);

            await page.render({ canvasContext: ctx, viewport }).promise;
            onImageConverted(canvas.toDataURL('image/png'));
        } finally {
            canvas.remove();
        }
    }
}
