import { View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/Theme/themeContext';
import { styles } from './carteiraStyle';

interface CadastroLayoutProps {
  title?: string;
  onAdd?: () => void;
  searchComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function Carteira({
  onAdd,
  searchComponent,
  filterComponent,
  children,
}: CadastroLayoutProps) {
  const { theme } = useTheme();
  const styleCarteira = styles(theme);


  return (
    <View style={styleCarteira.container}>
      <View style={styleCarteira.header}>
        

        {onAdd && (
          <TouchableOpacity style={styleCarteira.addButton} onPress={onAdd}>
            <MaterialCommunityIcons
              name="plus"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>

  
      {(searchComponent || filterComponent) && (
        <View style={styleCarteira.actions}>
          {searchComponent}
          {filterComponent}
        </View>
      )}

  
      <ScrollView
        contentContainerStyle={styleCarteira.list}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
