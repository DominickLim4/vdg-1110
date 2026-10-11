// WhatsApp que recebe os resgates (formato internacional, só dígitos).
export const WHATSAPP = '5598984230759'

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`
}

// Abre a conversa direto no WhatsApp. Chamar dentro do clique (sem await antes) para não ser bloqueado.
export function abrirWhatsApp(texto: string) {
  const janela = window.open(linkWhatsApp(texto), '_blank', 'noopener')
  if (!janela) location.href = linkWhatsApp(texto)
}
