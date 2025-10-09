"use client";

import React, { useState } from "react";
import Modal from "../../components/Modal";
import BottomSheet from "../../components/BottomSheet";
import { isMobileDevice } from "../../src/util";

export default function PopUpLayer({ children, isOpen, setIsOpen, ...rest }) {
    
    if (isMobileDevice()) {
        return (
        <BottomSheet {...rest} isOpen={isOpen} onClose={() => {setIsOpen(false)}}>
            {children}
        </BottomSheet>
        );
    } else {
        return (
        <Modal {...rest} isOpen={isOpen} onClose={() => {setIsOpen(false)}}>
            {children}
        </Modal>
        );
    }
}
