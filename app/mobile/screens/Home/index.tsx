import { View } from 'react-native';
import { useTheme } from '../../contexts/Theme/themeContext';
import { styles } from './styles';

import { HomeHeader } from '../../components/HomeHeader';
import { ProgramacaoSection } from '../../components/ProgramacaoSection';

export function Home() {
  const { theme } = useTheme();
  const homeStyles = styles(theme);

  return (
    <View style={homeStyles.container}>
      <HomeHeader />

      <View style={homeStyles.content}>
        <ProgramacaoSection />
      </View>
    </View>
  );
}