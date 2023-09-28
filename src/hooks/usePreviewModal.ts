import React from 'react';
import { Image } from '../model';

export const usePreviewModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [image, setImage] = React.useState<Image | undefined>(undefined);

    const show = React.useCallback((image: Image) => {
        setImage(image);
        setIsOpen(true);
    }, []);
    const close = React.useCallback(() => setIsOpen(false), []);

    const getPreviewModalProps = () => ({
        isOpen,
        onClose: close,
        image,
    });

    return {
        getPreviewModalProps,
        show,
    };
};
