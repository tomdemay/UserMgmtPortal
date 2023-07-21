package com.tomdemay.pro.usermgmtbackend.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EmptyStringToNullConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String dbData) {
        // Convert empty strings to null
        return dbData == null  || dbData.isBlank() ? null : dbData;
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return dbData == null || dbData.isBlank() ? null : dbData;
    }    
}
