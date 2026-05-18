import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';

import { useTheme } from '../../contexts/Theme/themeContext';

import { styles } from './styles';

import { useProgramacao } from '@/mobile/hooks/Home/useProgramacao';

type NavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

export function ProgramacaoSection() {
  const navigation = useNavigation<NavigationProps>();

  const { theme } = useTheme();

  const sectionStyles = styles(theme);

  const { dados } = useProgramacao();

  const possuiProgramacao = dados.length > 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.titleRow}>
          <Ionicons
            name="time-outline"
            size={22}
            color={theme.colors.text}
          />

          <Text style={sectionStyles.title}>
            Programação
          </Text>
        </View>

        <TouchableOpacity
          style={sectionStyles.button}
          onPress={() =>
            navigation.navigate('MedicamentoForm', {
              mode: 'create',
              medicamentoId: '',
            })
          }
        >
          <Ionicons
            name="add"
            size={18}
            color={theme.colors.text}
          />

          <Text style={sectionStyles.buttonText}>
            Novo
          </Text>
        </TouchableOpacity>
      </View>

      {!possuiProgramacao ? (
        <View
          style={{
            marginTop: 20,
            padding: 28,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              backgroundColor: theme.colors.primary + '20',
            }}
          >
            <Ionicons
              name="medkit-outline"
              size={36}
              color={theme.colors.primary}
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Nenhuma programação
          </Text>

          <Text
            style={{
              textAlign: 'center',
              lineHeight: 22,
              color: theme.colors.opaco,
              marginBottom: 20,
            }}
          >
            Você ainda não possui medicamentos
            programados para hoje.
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MedicamentoForm', {
                mode: 'create',
                medicamentoId: '',
              })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Ionicons
              name="add"
              size={18}
              color="#FFF"
            />

            <Text
              style={{
                color: '#FFF',
                fontWeight: '600',
              }}
            >
              Criar programação
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={sectionStyles.list}>
          {dados.flatMap((item) =>
            item.horarios.map((horario) => {
              const tomado =
                horario.status === 'RETIRADO';

              return (
                <View
                  key={horario.id}
                  style={[
                    sectionStyles.card,
                    tomado &&
                      sectionStyles.cardDone,
                  ]}
                >
                  <View style={sectionStyles.left}>
                    <View style={sectionStyles.iconBox}>
                      <Ionicons
                        name={
                          tomado
                            ? 'checkmark'
                            : 'medkit-outline'
                        }
                        size={24}
                        color={theme.colors.text}
                      />
                    </View>

                    <View>
                      <Text style={sectionStyles.name}>
                        {item.medicamento.nome}
                      </Text>

                      <Text style={sectionStyles.info}>
                        {item.medicamento.dosagem}
                      </Text>
                    </View>
                  </View>

                  <View style={sectionStyles.right}>
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.colors.opaco}
                    />

                    <Text style={sectionStyles.time}>
                      {horario.horario}
                    </Text>

                    {tomado && (
                      <Text
                        style={
                          sectionStyles.doneText
                        }
                      >
                        Tomado
                      </Text>
                    )}
                  </View>
                </View>
              );
            }),
          )}
        </View>
      )}
    </ScrollView>
  );
}