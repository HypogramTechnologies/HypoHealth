import { View } from 'react-native';
import { InputField } from '../Form/InputField';
import { Button } from '../Form/Button';

interface Props {
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  // Propriedades de press agora são opcionais (?)
  onFilterPress?: () => void;
  onAddPress?: () => void;
  placeholder?: string;
  hideAdd?: boolean;
  hideFilter?: boolean;
  hideSearch?: boolean;
}

export function CarteiraHeader({
  searchValue = '',
  onSearchChange,
  onFilterPress,
  onAddPress,
  placeholder = 'Buscar...',
  hideAdd = false,
  hideFilter = false,
  hideSearch = false,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}
    >
   
      {!hideSearch && onSearchChange && (
        <View style={{ flex: 1 }}>
          <InputField
            label=''
            placeholder={placeholder}
            value={searchValue}
            onChangeText={onSearchChange}
            icon="magnify"
            iconPosition='inside'
            marginBottom={-10}
          />
        </View>
      )}

      {!hideFilter && onFilterPress && (
        <Button
          icon="filter-variant"
          onPress={onFilterPress}
          label=''
          borderRadius={50}
          paddingHorizontal={15}
          marginTop={10}
        />
      )}

     
      {!hideAdd && onAddPress && (
        <Button
          icon="plus"
          onPress={onAddPress}
          label=''
          borderRadius={50}
          paddingHorizontal={15}
          marginTop={10}
        />
      )}
    </View>
  );
}