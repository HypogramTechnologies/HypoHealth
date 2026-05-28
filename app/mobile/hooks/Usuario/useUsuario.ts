// import {
//   useCallback,
//   useEffect,
//   useState,
// } from 'react';

// import { UsuarioService } from '../../services/usuarioService';

// import { useAuth } from '../Auth/useAuth';

// export function useUsuario() {
//   const {
//     usuario,
//   } = useAuth();

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] = useState<
//     string | null
//   >(null);
 
//   const buscarUsuario = useCallback(async () => {
//     if (!usuario?.id) return;

//     try {
//       setLoading(true);
//       setError(null);

      
//         const dados = await UsuarioService.getById(
//           usuario.id
//         );
//         console.log('Dados do usuário buscados:', dados);
//         return dados;
        
     
//     } catch (err: any) {
//       setError(
//         err.message ||
//           'Erro ao buscar usuário'
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [usuario?.id]);

//   useEffect(() => {
//     buscarUsuario();
//   }, [buscarUsuario]);

//   return {
//     usuario,
//     loading,
//     error,
//     buscarUsuario,
//   };
// }


import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import { UsuarioService } from '../../services/usuarioService';

import { useAuth } from '../Auth/useAuth';

export function useUsuario() {
  const {
    usuario,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const buscarUsuario = useCallback(async () => {
    if (!usuario?.id) return;

    try {
      setLoading(true);
      setError(null);

      const dados =
        await UsuarioService.getById(
          usuario.id,
        );

      console.log(
        'Dados do usuário buscados:',
        dados,
      );

      return dados;
    } catch (err: any) {
      setError(
        err.message ||
          'Erro ao buscar usuário',
      );
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  useFocusEffect(
    useCallback(() => {
      buscarUsuario();
    }, [buscarUsuario]),
  );

  return {
    usuario,
    loading,
    error,
    buscarUsuario,
  };
}