import { TouchableOpacity, View, Text, Animated } from 'react-native';
import { styles } from './styles';
import { useTheme } from '../../contexts/Theme/themeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { UserRole } from '@/src/types/Auth/usuario';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

interface CardCadastroProps {
  title: string;
  subtitle?: string;
  count?: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  routeName: keyof RootStackParamList;
  roles: UserRole[];
}

export function CardCadastro({
  title,
  subtitle,
  count,
  icon,
  routeName,
}: CardCadastroProps) {
  const navigation = useNavigation<RootNav>();
  const { theme } = useTheme();
  const stylesCardCadastro = styles(theme);


  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
  
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
   
      navigation.navigate(routeName as any);
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={stylesCardCadastro.container}>
   
      <Animated.View style={{ flexDirection: 'row', flex: 1, transform: [{ scale }] }}>
        
        <View style={stylesCardCadastro.left}>
          <View style={stylesCardCadastro.iconContainer}>
            <MaterialCommunityIcons
              name={icon}
              size={theme.sizes.iconSizeCard}
              style={stylesCardCadastro.icon}
            />
          </View>

          <View style={stylesCardCadastro.textContainer}>
            <Text style={stylesCardCadastro.title}>{title}</Text>
            {subtitle && (
              <Text style={stylesCardCadastro.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>

        <View style={stylesCardCadastro.right}>
          {typeof count === 'number' && (
            <View style={stylesCardCadastro.badge}>
              <Text style={stylesCardCadastro.badgeText}>{count}</Text>
            </View>
          )}
        </View>

      </Animated.View>
    </TouchableOpacity>
  );
}