import { cadastroSchema } from "@/mobile/schemas/cadastro.schama";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useCadastroScreen() {
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
      dispositivo_id: "bf909bc1-4110-454d-9ef5-eb9eb49db4e7",
    },
  });

  return {
    control,
    handleSubmit,
    errors,
  };
}