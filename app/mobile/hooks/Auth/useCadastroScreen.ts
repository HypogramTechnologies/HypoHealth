import { cadastroSchema } from "@/mobile/schemas/cadastro.schama";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DispositivoService } from "../../services/dispositivoService";

export function useCadastroScreen() {
  const [dispositivoId, setDispositivoId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      dispositivoId: "",
    },
  });

  useEffect(() => {
    async function load() {
      try {
        const dispositivo =
          await DispositivoService.getPrimeiro();

          console.log("Dispositivo encontrado:", dispositivo);

        if (!dispositivo) {
          console.warn("Nenhum dispositivo encontrado.");
          return;
        }

        setDispositivoId(dispositivo.id);
      } catch (error) {
        console.error("Erro ao buscar dispositivo:", error);
      }
    }

    load();
  }, []);

  return {
    control,
    handleSubmit,
    errors,
    dispositivoId,
  };
}