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

function PreviewContent({ image }: Pick<PreviewModalProps, 'onClose' | 'image'>) {
    return (
        <div className="xc-mt-3">
            <img src={image?.dataUrl} className="block shadow-md" alt={image?.dataUrl} />
        </div>
    );
}

export default PreviewModal;
