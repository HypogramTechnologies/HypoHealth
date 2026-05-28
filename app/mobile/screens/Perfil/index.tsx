// src/screens/Perfil/index.tsx

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Menu } from '../../components/Menu';

import { useTheme } from '../../contexts/Theme/themeContext';

import { styles } from './styles';

import { useUsuario } from '../../hooks/Usuario/useUsuario';

import { useAuth } from '../../hooks/Auth/useAuth';

export function Perfil() {
  const { theme } = useTheme();

  const profileStyles = styles(theme);

  const { usuario, loading, error } =
    useUsuario();

  const { logout } = useAuth();

  if (loading) {
    return (
      <View
        style={[
          profileStyles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />

        <Text
          style={{
            marginTop: 12,
            color: theme.colors.text,
          }}
        >
          Carregando perfil...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          profileStyles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={42}
          color={theme.colors.error}
        />

        <Text
          style={{
            marginTop: 12,
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={profileStyles.header}>
          {/* <TouchableOpacity
            style={profileStyles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity> */}

          <Text style={profileStyles.headerTitle}>
            Meu perfil
          </Text>
        </View>

        <View style={profileStyles.userArea}>
          <View style={profileStyles.avatar}>
            <Ionicons
              name="person-outline"
              size={38}
              color={
                theme.colors.textInverted
              }
            />
          </View>

          <Text style={profileStyles.name}>
            {usuario?.nome}
          </Text>
        </View>

        <View style={profileStyles.card}>
          <Ionicons
            name="mail-outline"
            size={22}
            color={theme.colors.primary}
          />

          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.label}>
              E-mail
            </Text>

            <Text style={profileStyles.value}>
              {usuario?.email}
            </Text>
          </View>
        </View>

        <Menu
          profileStyles={profileStyles}
          theme={theme}
        />

        {!!usuario?.dispositivos?.length && (
          <View style={profileStyles.menuCard}>
            <Text
              style={
                profileStyles.sectionTitle
              }
            >
              Dispositivos cadastrados
            </Text>

            {usuario.dispositivos.map(
              (dispositivo) => (
                <View
                  key={dispositivo.id}
                  style={
                    profileStyles.responsavel
                  }
                >
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={
                      theme.colors.opaco
                    }
                  />

                  <View>
                    <Text
                      style={
                        profileStyles
                          .responsavelNome
                      }
                    >
                      {dispositivo.nome}
                    </Text>

                  </View>
                </View>
              )
            )}
          </View>
        )}

        <TouchableOpacity
          style={profileStyles.logoutButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FFF"
          />

          <Text
            style={profileStyles.logoutText}
          >
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}