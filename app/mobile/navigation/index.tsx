import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './appStack';

enableScreens();

export function Navigation() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
