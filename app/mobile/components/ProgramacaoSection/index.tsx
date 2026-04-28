import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/Theme/themeContext';
import { styles } from './styles';

export function ProgramacaoSection() {
  const { theme } = useTheme();
  const sectionStyles = styles(theme);

  const medicamentos = [
    {
      nome: 'Losartana',
      dose: '50mg',
      gaveta: 'Gaveta 1',
      horario: '08:00',
      tomado: true,
    },
    {
      nome: 'Metformina',
      dose: '500mg',
      gaveta: 'Gaveta 2',
      horario: '12:00',
    },
    {
      nome: 'Omeprazol',
      dose: '20mg',
      gaveta: 'Gaveta 3',
      horario: '18:00',
    },
    {
      nome: 'AAS',
      dose: '100mg',
      gaveta: 'Gaveta 4',
      horario: '20:00',
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.titleRow}>
          <Ionicons name="time-outline" size={22} color={theme.colors.text} />
          <Text style={sectionStyles.title}>Programação</Text>
        </View>

        <TouchableOpacity style={sectionStyles.button}>
          <Ionicons name="add" size={18} color={theme.colors.text} />
          <Text style={sectionStyles.buttonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={sectionStyles.list}>
        {medicamentos.map((item, index) => (
          <View
            key={index}
            style={[
              sectionStyles.card,
              item.tomado && sectionStyles.cardDone,
            ]}
          >
            <View style={sectionStyles.left}>
              <View style={sectionStyles.iconBox}>
                <Ionicons
                  name={item.tomado ? 'checkmark' : 'medkit-outline'}
                  size={24}
                  color={theme.colors.text}
                />
              </View>

              <View>
                <Text style={sectionStyles.name}>{item.nome}</Text>
                <Text style={sectionStyles.info}>
                  {item.dose} • {item.gaveta}
                </Text>
              </View>
            </View>

            <View style={sectionStyles.right}>
              <Ionicons name="time-outline" size={18} color={theme.colors.opaco} />
              <Text style={sectionStyles.time}>{item.horario}</Text>

              {item.tomado && (
                <Text style={sectionStyles.doneText}>Tomado</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}