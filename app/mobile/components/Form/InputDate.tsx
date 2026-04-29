import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { InputField } from './InputField';
import { formatarData } from '../../utils/formatar';

interface DateFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  readOnly?: boolean;
}

export function DateField<TFormValues extends FieldValues>({
  name,
  label,
  control,
  errors,
  readOnly,
}: DateFieldProps<TFormValues>) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <InputField
            label={label}
            icon="calendar"
            value={field.value ? formatarData(field.value) : ''}
            editable={false}
            placeholder="Selecione a data"
            onPress={() => !readOnly && setShowPicker(true)}
            error={errors?.[name]?.message as string | undefined}
          />

          {showPicker && (
            <DateTimePicker
              value={field.value ? new Date(field.value as Date) : new Date()}
              mode="date"
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) field.onChange(date);
              }}
            />
          )}
        </>
      )}
    />
  );
}