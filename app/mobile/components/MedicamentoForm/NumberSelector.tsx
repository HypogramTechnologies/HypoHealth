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
  description?: string[];
  selected: number[];
  multiple?: boolean;
  onChange(value: number): void;
};

export function NumberSelector({
  values,
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
        const active = selected.includes(item);
        const label = description[index]; 

        return (
          <TouchableOpacity
            key={item}
            style={[
              s.numberBox,
              active && s.numberBoxActive,
            ]}
            onPress={() => onChange(item)}
          >
            
            {label && (
              <Text
                style={[
                  s.descriptionText,
                  active && s.descriptionTextActive,
                ]}
              >
                {label}
              </Text>
            )}

           
            <Text
              style={[
                s.numberText,
                active && s.numberTextActive,
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