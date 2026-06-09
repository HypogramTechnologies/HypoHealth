import React, { PropsWithChildren, useEffect, useRef, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ScrollView, // Adicionado para permitir rolagem do conteúdo
  KeyboardAvoidingView, // Adicionado para ajustar o conteúdo internamente
  Platform,
} from 'react-native';
import { useTheme } from '../../contexts/Theme/themeContext';

const { height } = Dimensions.get('window');

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  heightPercent?: number;
  backgroundColor?: string;
}>;

export function FakeBottomSheet({
  visible,
  onClose,
  children,
  heightPercent = 0.85, // Mantido em 85% como você pediu
}: Props) {
  
  const sheetHeight = useMemo(
    () => height * heightPercent,
    [heightPercent]
  );

  const translateY = useRef(
    new Animated.Value(sheetHeight)
  ).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : sheetHeight,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible, sheetHeight, translateY]);

  const { theme } = useTheme();
  
  if (!visible) return null;

  return (
    <View
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, height: height },
        { zIndex: 9999, elevation: 9999 },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            backgroundColor: theme.colors.backgroundCard,
            transform: [{ translateY }],
            zIndex: 10000,
            elevation: 10000,
          },
        ]}
      >
        <View style={styles.handle} />
        
        {/* KeyboardAvoidingView interno: Ele não deixa a estrutura da aba subir, 
          mas avisa o conteúdo de dentro que o teclado abriu para ele se ajustar.
        */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          {/* ScrollView: Garante que se o teclado tampar algo, 
            o usuário consegue rolar a tela para ver os botões de baixo.
          */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#726c6c',
    alignSelf: 'center',
    marginBottom: 12,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Uma folga extra no fundo para os botões respirarem
  },
});