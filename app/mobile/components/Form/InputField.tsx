import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardTypeOptions,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/Theme/themeContext';
import { FormError } from './FormError';

interface Props {
  label: string;
  icon?: string;
  iconPosition?: 'top' | 'inside';
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  value?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  marginBottom?: number;
  error?: string;
}

export function InputField({
  label,
  icon,
  iconPosition = 'top',
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  value,
  placeholder,
  editable = true,
  onPress,
  onChangeText,
  keyboardType = 'default',
  error,
  marginBottom,
}: Props) {
  const { theme } = useTheme();
  const isPressable = !!onPress && !editable;

  const borderColor = error
    ? theme.colors.error
    : theme.colors.primary;

  const displayValue = value ?? '';

  function handleChange(text: string) {
    onChangeText?.(text);
  }

  const InputContent = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor,
        borderRadius: 10,
        backgroundColor: theme.colors.backgroundCard,
        paddingHorizontal: 12,
      }}
    >
      {/* ÍCONE ESQUERDA */}
      {icon && iconPosition === 'inside' && (
        <MaterialCommunityIcons
          name={icon as any} 
          size={20}
          color={theme.colors.primary}
          style={{ marginRight: 8 }}
        />
      )}

      {/* INPUT */}
      <TextInput
        value={displayValue}
        placeholder={placeholder}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={handleChange}
        placeholderTextColor={theme.colors.opaco}
        secureTextEntry={secureTextEntry}
        style={{
          flex: 1,
          paddingVertical: 12,
          fontSize: theme.sizes.mediumText.fontSize,
          color: theme.colors.text,
        }}
      />

      {/* ÍCONE DIREITA (ex: olho) */}
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ marginBottom: marginBottom || 16 }}>
      {(label || (icon && iconPosition === 'top')) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          {icon && iconPosition === 'top' && (
            <MaterialCommunityIcons
              name={icon as any} // 🔥 CORRIGIDO
              size={18}
              color={theme.colors.detail}
            />
          )}

          {label && (
            <Text
              style={{
                marginLeft: icon && iconPosition === 'top' ? 6 : 0,
                color: theme.colors.text,
                fontSize: theme.sizes.mediumText.fontSize,
              }}
            >
              {label}
            </Text>
          )}
        </View>
      )}

      {isPressable ? (
        <Pressable onPress={onPress}>{InputContent}</Pressable>
      ) : (
        InputContent
      )}

      <FormError message={error} />
    </View>
  );
}