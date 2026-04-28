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
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress(): void;
};

export function SelectCard({
  title,
  subtitle,
  icon,
  active,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const s = useStyles(theme);

  return (
    <TouchableOpacity
      style={[
        s.selectCard,
        active && s.selectCardActive,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={26}
        color={theme.colors.primary}
      />

      <Text style={s.selectTitle}>
        {title}
      </Text>

      {subtitle && (
        <Text style={s.selectSubtitle}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
}