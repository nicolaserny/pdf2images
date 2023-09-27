import Modal from './Modal';

type PreviewModalProps = {
    onClose: () => void;
    isOpen: boolean;
    imageUrl?: string;
};

function PreviewModal({ onClose, imageUrl, ...props }: PreviewModalProps) {
    return (
        <Modal {...props} onClose={onClose}>
            <PreviewContent onClose={onClose} imageUrl={imageUrl} />
        </Modal>
    );
}

function PreviewContent({ imageUrl }: Pick<PreviewModalProps, 'onClose' | 'imageUrl'>) {
    return (
        <div className="xc-mt-3">
            <img src={imageUrl} className="block shadow-md" alt="" />
        </div>
    );
}

export default PreviewModal;
