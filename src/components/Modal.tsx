import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    initialFocus?: React.RefObject<HTMLElement>;
};

function Modal({ children, isOpen, onClose, initialFocus }: ModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog unmount={true} as="div" className="relative z-10" onClose={onClose} initialFocus={initialFocus}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#212121] opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                as="section"
                                aria-label="modal"
                                className="my-4 w-4/5 transform rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all"
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Modal;
