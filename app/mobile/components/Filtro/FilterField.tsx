import { View, Text, TextInput } from 'react-native';
import { FilterFieldConfig } from './types';
import { InputField } from '../Form/InputField';
import { InputCombo } from '../Form/InputCombo';
import { useComboOptions } from '../../hooks/Combo/useComboOptions';

interface Props {
  field: FilterFieldConfig;
  value: any;
  onChange: (value: any) => void;
}


export function FilterField({ field, value, onChange }: Props) {
  const { options, loading } = useComboOptions(field.source ?? undefined);

  switch (field.type) {
    case 'text':
      return (
        <View>
          <InputField
            icon={field.icon}
            label={field.label}
            placeholder={field.placeholder}
            value={value ?? ''}
            onChangeText={text => onChange(text)}
            keyboardType="default"
          />
        </View>
      );

    case 'number':
      return (
        <View>
          <InputField
            label={field.label}
            icon={field.icon}
            placeholder={field.placeholder}
            keyboardType="numeric"
            value={value ?? ''}
            onChangeText={(v) => {
              onChange(v); 
            }}
          />
        </View>
      );

    case 'combo':
      return (
        <View>
          <InputCombo
            label={field.label}
            icon={field.icon}
            value={value ?? ''}
            onChange={v => onChange(v)}
            options={options}
            loading={loading}
          />
        </View>
      );
    case 'boolean':
      return (
        <View>
          <InputCombo
            label={field.label}
            icon={field.icon}
            value={
              value === true
                ? 'true'
                : value === false
                ? 'false'
                : value === 'all'
                ? 'all'
                : undefined
            }
            onChange={v => {
              if (v === 'all') onChange('all');
              else if (v === 'true') onChange(true);
              else if (v === 'false') onChange(false);
            }}
            options={[
              { label: 'Todos', value: 'all' },
              { label: 'Sim', value: 'true' },
              { label: 'Não', value: 'false' },
            ]}
            loading={false}
          />
        </View>
      );

    case 'range':
      return (
        <View>
          <Text>{field.label}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              placeholder="Mínimo"
              keyboardType="numeric"
              onChangeText={v => onChange({ ...value, min: Number(v) })}
            />
            <TextInput
              placeholder="Máximo"
              keyboardType="numeric"
              onChangeText={v => onChange({ ...value, max: Number(v) })}
            />
          </View>
        </View>
      );

    default:
      return null;
  }
}
