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
  
//   const saveAll = async (data: AbastecimentoFormData) => {
//     setLoading(true);
//     try {
//       const dataTratada = convertUndefinedToNull(data);
//       if (isCreate) {
//        await AbastecimentoService.criar(dataTratada);
       

//       } else if (abastecimentoId) {
//         await AbastecimentoService.atualizar(abastecimentoId, dataTratada);
//       }

//       navigation?.goBack();
//     } catch (error) {
//       console.error("Erro no salvamento unificado:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//   if (!abastecimentoId || isCreate) return;

//   let isMounted = true;

//  setLoading(true);
  
//   AbastecimentoService.buscarPorId(abastecimentoId)
//     .then(abastecimento => {
//       if (!isMounted) return;
//       reset(mapAbastecimentoToForm(abastecimento));
//     })
//     .finally(() => {
//       if (isMounted) setLoading(false);
//     });

//   return () => {
//     isMounted = false;
//   };
// }, [abastecimentoId, isCreate, reset, setLoading]);


  return {
    control,
    errors,
    handleSubmit,
    setValue,
  };
}
