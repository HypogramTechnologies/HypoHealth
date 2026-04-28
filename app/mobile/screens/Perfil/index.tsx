// src/screens/Perfil/index.tsx

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Menu} from '../../components/Menu';

import { useTheme } from '../../contexts/Theme/themeContext';
import { styles } from './styles';

export function Perfil() {
  const { theme } = useTheme();
  const profileStyles = styles(theme);

  return (
    <View style={profileStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
  
        <View style={profileStyles.header}>
          <TouchableOpacity style={profileStyles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <Text style={profileStyles.headerTitle}>Meu perfil</Text>
        </View>

  
        <View style={profileStyles.userArea}>
          <View style={profileStyles.avatar}>
            <Ionicons
              name="person-outline"
              size={38}
              color={theme.colors.textInverted}
            />
          </View>

          <Text style={profileStyles.name}>Maria Silva</Text>
        </View>

   
        <View style={profileStyles.card}>
          <Ionicons
            name="mail-outline"
            size={22}
            color={theme.colors.primary}
          />

          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.label}>E-mail</Text>
            <Text style={profileStyles.value}>maria@email.com</Text>
          </View>
        </View>

    
        <View style={profileStyles.card}>
          <Ionicons
            name="call-outline"
            size={22}
            color={theme.colors.primary}
          />

          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.label}>Telefone</Text>
            <Text style={profileStyles.value}>(12) 99999-1234</Text>
          </View>
        </View>

        <Menu profileStyles={profileStyles} theme={theme} />

        <View style={profileStyles.menuCard}>
          <Text style={profileStyles.sectionTitle}>
            Responsáveis cadastrados
          </Text>

          <View style={profileStyles.responsavel}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.colors.opaco}
            />

            <View>
              <Text style={profileStyles.responsavelNome}>
                João Silva (Filho)
              </Text>
              <Text style={profileStyles.responsavelTelefone}>
                (12) 98888-5678
              </Text>
            </View>
          </View>
        </View>

        {/* SAIR */}
        <TouchableOpacity style={profileStyles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FFF"
          />
          <Text style={profileStyles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}