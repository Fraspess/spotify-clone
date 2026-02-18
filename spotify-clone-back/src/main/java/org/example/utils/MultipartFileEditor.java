package org.example.utils;

import java.beans.PropertyEditorSupport;

public class MultipartFileEditor extends PropertyEditorSupport {
    @Override
    public void setAsText(String text) {
        if (text == null || text.isEmpty()) {
            setValue(null);
        }
    }
}