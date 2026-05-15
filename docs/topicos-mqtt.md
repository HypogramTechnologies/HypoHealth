## Estrutura de Tópicos — HypoHealth

### Padrão

```txt id="5b9hh4"
dispositivo/{MAC}/[comando|evento]
```

* `{MAC}` → Identificação do dispositivo

---

## Comunicação

| Tipo           | Tópico                      | Payload                                                        |
| -------------- | --------------------------- | -------------------------------------------------------------- |
| Server → ESP32 | `dispositivo/{MAC}/comando` | `json\n{\n  "acao": "ABRIR",\n  "compartimento": 1\n}\n`       |
| ESP32 → Server | `dispositivo/{MAC}/evento`  | `json\n{\n  "evento": "ABERTURA",\n  "status": "SUCESSO"\n}\n` |
