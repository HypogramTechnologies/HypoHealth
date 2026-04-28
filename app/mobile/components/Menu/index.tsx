import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import {cadastros} from '../../config/cadastros';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  profileStyles: any;
  theme: any;
}

export function Menu({ profileStyles, theme }: Props) {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={profileStyles.menuCard}>
      <Text style={profileStyles.sectionTitle}>Cadastros</Text>

      {cadastros.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={profileStyles.menuItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={theme.colors.primary}
          />

          <Text style={profileStyles.menuText}>
            {item.label}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.opaco}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}