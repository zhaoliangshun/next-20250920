"use client";

import React, { useState } from "react";
import Modal from "../../components/Modal";
import BottomSheet from "../../components/BottomSheet";
import { isMobileDevice } from "../../src/util";

export default function PopUpLayer({ children, isOpen, setIsOpen }) {
    
    if (isMobileDevice()) {
        return (
        <BottomSheet isOpen={isOpen} onClose={() => {setIsOpen(false)}}>
            {children}
        </BottomSheet>
        );
    } else {
        return (
        <Modal isOpen={isOpen} onClose={() => {setIsOpen(false)}}>
            {children}
        </Modal>
        );
    }
}
