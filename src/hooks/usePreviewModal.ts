import React from 'react';

export const usePreviewModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [previewImageUrl, setPreviewImageUrl] = React.useState<string | undefined>(undefined);

    const show = React.useCallback((imageUrl: string) => {
        setPreviewImageUrl(imageUrl);
        setIsOpen(true);
    }, []);
    const close = React.useCallback(() => setIsOpen(false), []);

    const getPreviewModalProps = () => ({
        isOpen,
        onClose: close,
        imageUrl: previewImageUrl,
    });

    return {
        getPreviewModalProps,
        show,
    };
};
