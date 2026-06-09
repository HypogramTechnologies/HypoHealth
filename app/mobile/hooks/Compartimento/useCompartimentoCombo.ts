// import { useEffect, useState, useCallback, useRef } from 'react';
// import { CompartimentoService } from '../../services/compartimentoService';
// import { ComboOption } from '@/mobile/types/Outros/combo';

// type UseCompartimentoComboError = {
//   message: string;
// };

// export function useCompartimentoCombo() {
//   const [optionsCompartimentos, setOptions] = useState<ComboOption[]>([]);
//   const [loadingCompartimentos, setLoading] = useState(false);
//   const [errorCompartimentos, setError] = useState<UseCompartimentoComboError | null>(null);

//   const isMountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   const loadCompartimentos = useCallback(async () => {
//     if (!isMountedRef.current) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const data = await CompartimentoService.buscarCombo();

//       const mapped: ComboOption[] = Array.isArray(data)
//         ? data.map((c) => ({
//             value: c.value,
//             label: c.label,
//           }))
//         : [];

//       if (isMountedRef.current) {
//         setOptions(mapped);
//       }
//     } catch (err: any) {
//       console.error("Erro ao carregar combo de compartimentos:", err);

//       if (isMountedRef.current) {
//         setError({
//           message: err?.message || "Erro ao carregar compartimentos",
//         });

//         setOptions([]);

//       }
//     } finally {
//       if (isMountedRef.current) {
//         setLoading(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     loadCompartimentos();
//   }, [loadCompartimentos]);

//   return {
//     optionsCompartimentos,
//     loadingCompartimentos,
//     errorCompartimentos,
//     recarregarCompartimentos: loadCompartimentos,
//   };
// }