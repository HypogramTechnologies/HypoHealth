import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/Theme/themeContext';
import { useStyles } from './styles';

type Props = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
  onPress(): void;
};

export function ActionButton({
  title,
  icon,
  outlined,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const s = useStyles(theme);

  return (
    <TouchableOpacity
      style={[
        outlined
          ? s.btnOutline
          : s.btnPrimary,
      ]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={
            outlined
              ? theme.colors.primary
              : theme.colors.text
          }
        />
      )}

      <Text
        style={
          outlined
            ? s.btnOutlineText
            : s.btnPrimaryText
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}