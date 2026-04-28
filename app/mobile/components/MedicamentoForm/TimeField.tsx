import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/Theme/themeContext';
import { useStyles } from './styles';

type Props = {
  value: string;
  onChange(text: string): void;
  onRemove?(): void;
};

export function TimeField({
  value,
  onChange,
  onRemove,
}: Props) {
  const { theme } = useTheme();
  const s = useStyles(theme);

  return (
    <View style={s.timeRow}>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={s.timeInput}
      />

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}