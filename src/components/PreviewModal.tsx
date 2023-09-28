import { Image } from '../model';
import Modal from './Modal';

type PreviewModalProps = {
    onClose: () => void;
    isOpen: boolean;
    image?: Image;
};

function PreviewModal({ onClose, image, ...props }: PreviewModalProps) {
    return (
        <Modal {...props} onClose={onClose}>
            <PreviewContent onClose={onClose} image={image} />
        </Modal>
    );
}

function PreviewContent({ image, onClose }: Pick<PreviewModalProps, 'onClose' | 'image'>) {
    return (
        <div className="relative">
            <button className="absolute right-2 top-2 p-3" onClick={onClose}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-7 w-7"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
            </button>
            <img src={image?.dataUrl} className="block shadow-md" alt={image?.dataUrl} />
        </div>
    );
}

export default PreviewModal;
