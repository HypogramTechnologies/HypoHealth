// import { useEffect, useState, useCallback, useRef } from 'react';
// import { DispositivoService } from '../../services/dispositivoService';
// import { ComboOption } from '@/mobile/types/Outros/combo';

// type UseDispositivoComboError = {
//   message: string;
// };

// export function useDispositivoCombo() {
//   const [optionsDispositivos, setOptions] = useState<ComboOption[]>([]);
//   const [loadingDispositivos, setLoading] = useState(false);
//   const [errorDispositivos, setError] = useState<UseDispositivoComboError | null>(null);

//   const isMountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   const loadDispositivos = useCallback(async () => {
//     if (!isMountedRef.current) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const data = await DispositivoService.buscarCombo();

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
//     loadDispositivos();
//   }, [loadDispositivos]);

//   return {
//     optionsDispositivos,
//     loadingDispositivos,
//     errorDispositivos,
//     recarregarDispositivos: loadDispositivos,
//   };
// }