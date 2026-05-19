// import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginSchema,
  LoginFormData,
} from '../../../mobile/schemas/login';

// import { AbastecimentoService } from '../../../shared/services/abastecimentoService';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';


type Navigation = NativeStackNavigationProp<RootStackParamList>;


export function useLoginScreen() {

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuarioLogin: '',
      usuarioSenha: ''
    },
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = form;
  


  return {
    control,
    errors,
    handleSubmit,
    setValue,
  };
}
