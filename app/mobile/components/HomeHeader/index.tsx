import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/Theme/themeContext';
import { useAuth } from '../../hooks/Auth/useAuth';

import { useHomeHeader } from '../../hooks/Home/useHomeHeader';
import { obterSaudacao } from '../../utils/obterSaudacao';
import { styles } from './styles';

export function HomeHeader() {
  const { theme } = useTheme();

  const { usuario } = useAuth();

  const { dados } = useHomeHeader();

  const headerStyles = styles(theme);

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.topRow}>
        <View>
          <Text style={headerStyles.greeting}>
            {obterSaudacao()}
          </Text>

          <Text style={headerStyles.name}>
            {usuario?.nome}
          </Text>
        </View>

        <TouchableOpacity style={headerStyles.profileButton}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <View style={headerStyles.card}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color="#FFF"
        />

        <View>
          <Text style={headerStyles.cardTitle}>
            Hoje, {dados?.dataAtual}
          </Text>

          <Text style={headerStyles.cardSubtitle}>
            {dados?.totalMedicamentosHoje || 0}
            {" "}medicamentos •{" "}
            {dados?.totalTomadosHoje || 0}
            {" "}tomados
          </Text>
        </View>
      </View>
    </View>
  );
}