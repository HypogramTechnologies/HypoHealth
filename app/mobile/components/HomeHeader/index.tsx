import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/Theme/themeContext';
import { styles } from './styles';

export function HomeHeader() {
  const { theme } = useTheme();
  const headerStyles = styles(theme);

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.topRow}>
        <View>
          <Text style={headerStyles.greeting}>Boa tarde!</Text>
          <Text style={headerStyles.name}>Maria</Text>
        </View>

        <TouchableOpacity style={headerStyles.profileButton}>
          <Ionicons name="person-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={headerStyles.card}>
        <Ionicons name="calendar-outline" size={24} color="#FFF" />

        <View>
          <Text style={headerStyles.cardTitle}>
            Hoje, segunda-feira, 27 de abril
          </Text>

          <Text style={headerStyles.cardSubtitle}>
            4 medicamentos • 1 tomado
          </Text>
        </View>
      </View>
    </View>
  );
}