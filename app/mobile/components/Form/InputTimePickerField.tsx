import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../contexts/Theme/themeContext';

interface Props {
  label: string;
  icon?: string;
  value?: string; 
  placeholder?: string;
  onChange?: (time: string) => void; 
  editable?: boolean;
}

export function TimePickerField({
  label,
  icon,
  value,
  placeholder = 'Selecione o horário',
  onChange,
  editable = true,
}: Props) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = () => {
    if (editable) setShowPicker(true);
  };

  const handleChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false); 
    if (date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formatted = `${hours}:${minutes}`;
      onChange?.(formatted); 
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        {icon && (
          <MaterialCommunityIcons
            icon={icon}
            size={theme.sizes.mediumText.fontSize}
            color={theme.colors.detail}
          />
        )}
        <Text
          style={{
            marginLeft: icon ? 6 : 0,
            color: theme.colors.text,
            fontSize: theme.sizes.mediumText.fontSize,
          }}
        >
          {label}
        </Text>
      </View>

      <Pressable onPress={handlePress}>
        <TextInput
          value={value} 
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.detail,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: theme.sizes.mediumText.fontSize,
            backgroundColor: theme.colors.backgroundCard,
            color: theme.colors.text,
          }}
        />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(`1970-01-01T${value}:00`) : new Date()}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
