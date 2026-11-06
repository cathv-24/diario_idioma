import { useEffect, useState } from "react";
import * as api from "../lib/api";

export default function AiConsent({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    if (api.apiMode) void api.correctionCapabilities().then(data => { if (active) setAvailable(data.ia); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return <div className="ai-consent">
    {available ? <label className="learning-consent"><input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} />
      <span>Quiero una revisión contextual con Gemini para esta entrada. Soy mayor de 18 años y acepto enviar este texto a Google. Evitaré incluir información personal o sensible. <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">Consultar condiciones de uso y datos</a>.</span>
    </label> : <p className="small-muted">La revisión contextual con IA no está disponible en este entorno. Al guardar se aplicarán las reglas de corrección disponibles.</p>}
  </div>;
}
