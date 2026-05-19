import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { useTheme } from '../../contexts/Theme/themeContext';
import { useStyles } from './styles';

type ValueType = string | number;

type Props = {
  values: ValueType[];
  title?: string[];
  description?: string[];

  selected: ValueType[];

  multiple?: boolean;

  onChange(value: ValueType): void;
};

export function NumberSelector({
  values,
  title = [],
  description = [],
  selected,
  multiple = false,
  onChange,
}: Props) {
  const { theme } = useTheme();

  const s = useStyles(theme);

  return (
    <View style={s.grid}>
      {values.map((item, index) => {
        const active =
          selected.includes(item);

        const label =
          description[index];

          const subtitle = title[index];
        return (
          <TouchableOpacity
            key={String(item)}
            style={[
              s.numberBox,
              active &&
                s.numberBoxActive,
            ]}
            onPress={() =>
              onChange(item)
            }
          >
            {label && (
              <Text
                style={[
                  s.descriptionText,
                  active &&
                    s.descriptionTextActive,
                ]}
              >
                {label}
              </Text>
            )}

            <Text
              style={[
                s.numberText,
                active &&
                  s.numberTextActive,
              ]}
            >
              {String(subtitle)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}