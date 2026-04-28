import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '../../contexts/Theme/themeContext';
import { useStyles } from './styles';

type Props = {
  values: number[];
  selected: number[];
  multiple?: boolean;
  onChange(value: number): void;
};

export function NumberSelector({
  values,
  selected,
  multiple = false,
  onChange,
}: Props) {
  const { theme } = useTheme();
  const s = useStyles(theme);

  return (
    <View style={s.grid}>
      {values.map(item => {
        const active =
          selected.includes(item);

        return (
          <TouchableOpacity
            key={item}
            style={[
              s.numberBox,
              active &&
                s.numberBoxActive,
            ]}
            onPress={() =>
              onChange(item)
            }
          >
            <Text
              style={[
                s.numberText,
                active &&
                  s.numberTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}