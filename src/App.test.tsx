import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as converterModule from './utils/converter';

import App from './App';

function createMockPdfFile(name: string): File {
    return new File(['file'], name, { type: 'application/pdf' });
}

describe('<App />', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should render a page with the title', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /pdf to images/i })).toBeInTheDocument();
    });

    it('should display images when the user drops pdf files', async () => {
        const convertPdfFileToImagesMock = vi.spyOn(converterModule, 'convertPdfFileToImages');
        const fileName1 = 'test-file1.pdf';
        const fileName2 = 'test-file2.pdf';
        convertPdfFileToImagesMock.mockImplementation(async (file, callback) => {
            if (file.name === fileName1) {
                callback('images1');
                callback('images2');
            }
            if (file.name === fileName2) {
                callback('images3');
            }
        });
        render(<App />);
        const dropzone = screen.getByLabelText(/Drag and drop some pdf files or browse/i);
        expect(dropzone).toBeInTheDocument();

        Object.defineProperty(dropzone, 'files', {
            value: [createMockPdfFile(fileName1), createMockPdfFile(fileName2)],
        });
        fireEvent.drop(dropzone);

        expect(await screen.findByRole('heading', { name: fileName1 })).toBeInTheDocument();
        expect(await screen.findByRole('img', { name: `File ${fileName1} - Page 1` })).toBeInTheDocument();
        expect(await screen.findByRole('img', { name: `File ${fileName1} - Page 2` })).toBeInTheDocument();

        expect(await screen.findByRole('heading', { name: fileName2 })).toBeInTheDocument();
        expect(await screen.findByRole('img', { name: `File ${fileName2} - Page 1` })).toBeInTheDocument();
    });

    it('should display an error message if it cannot convert the input file', async () => {
        const convertPdfFileToImagesMock = vi.spyOn(converterModule, 'convertPdfFileToImages');
        const fileName = 'test-file1.pdf';
        convertPdfFileToImagesMock.mockImplementation(async () => {
            throw new Error(`Cannot convert`);
        });
        render(<App />);
        const dropzone = screen.getByLabelText(/Drag and drop some pdf files or browse/i);
        expect(dropzone).toBeInTheDocument();

        Object.defineProperty(dropzone, 'files', {
            value: [createMockPdfFile(fileName)],
        });
        fireEvent.drop(dropzone);

        expect(await screen.findByText(`Cannot convert ${fileName}`)).toBeInTheDocument();
    });
});
