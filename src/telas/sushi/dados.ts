// Ingredientes e opções da cozinha (Monte seu Sushi).

export interface PeixeSushi {
  id: string
  nome: string
  cor: string
  listra: string
  nota: string
}

export const PEIXES_SUSHI: PeixeSushi[] = [
  { id: 'salmao', nome: 'Salmão', cor: '#F07B4F', listra: '#FFC1A1', nota: 'O clássico. Nunca erra.' },
  { id: 'atum', nome: 'Atum', cor: '#C8324A', listra: '#E66A7E', nota: 'Vermelho, tipo o Mengão.' },
  { id: 'peixe-branco', nome: 'Peixe-branco', cor: '#F4ECE0', listra: '#DCCDB9', nota: 'Delicado e elegante.' },
  { id: 'enguia', nome: 'Enguia', cor: '#8A5A2B', listra: '#B98A52', nota: 'Unagi. A Abigail aprovaria (ela ama enguia apimentada).' },
  { id: 'camarao', nome: 'Camarão', cor: '#F79A7A', listra: '#FFFFFF', nota: 'Laranjinha e listrado.' },
  { id: 'polvo', nome: 'Polvo', cor: '#D98BA8', listra: '#F6D3E0', nota: 'Para quem gosta de aventura.' },
]

export type Formato = 'nigiri' | 'sashimi' | 'uramaki' | 'hossomaki' | 'temaki' | 'hotroll'

export const FORMATOS: { id: Formato; nome: string; descricao: string }[] = [
  { id: 'nigiri', nome: 'Nigiri', descricao: 'Bolinho de arroz com o peixe por cima.' },
  { id: 'sashimi', nome: 'Sashimi', descricao: 'Só as fatias, sem arroz.' },
  { id: 'uramaki', nome: 'Uramaki', descricao: 'Arroz por fora, alga por dentro.' },
  { id: 'hossomaki', nome: 'Hossomaki', descricao: 'Fininho, alga por fora.' },
  { id: 'temaki', nome: 'Temaki', descricao: 'Cone de alga recheado.' },
  { id: 'hotroll', nome: 'Hot roll', descricao: 'Empanado e frito. Sem culpa.' },
]

export type TipoIngrediente = 'recheio' | 'cobertura' | 'acompanhamento'

export interface Ingrediente {
  id: string
  nome: string
  cor: string
  tipo: TipoIngrediente
}

export const INGREDIENTES: Ingrediente[] = [
  { id: 'cream-cheese', nome: 'Cream cheese', cor: '#FFFDF5', tipo: 'recheio' },
  { id: 'pepino', nome: 'Pepino', cor: '#7CC46A', tipo: 'recheio' },
  { id: 'manga', nome: 'Manga', cor: '#F5C242', tipo: 'recheio' },
  { id: 'kani', nome: 'Kani', cor: '#E2556F', tipo: 'recheio' },
  { id: 'cebolinha', nome: 'Cebolinha', cor: '#4F8A3C', tipo: 'cobertura' },
  { id: 'gergelim', nome: 'Gergelim', cor: '#F3DDB0', tipo: 'cobertura' },
  { id: 'ovas', nome: 'Ovas', cor: '#F28C28', tipo: 'cobertura' },
  { id: 'tare', nome: 'Tarê', cor: '#5A3214', tipo: 'cobertura' },
  { id: 'morango', nome: 'Morango', cor: '#D7263D', tipo: 'cobertura' },
  { id: 'wasabi', nome: 'Wasabi', cor: '#9ACD5A', tipo: 'acompanhamento' },
  { id: 'gengibre', nome: 'Gengibre', cor: '#F6C1C9', tipo: 'acompanhamento' },
  { id: 'shoyu', nome: 'Shoyu', cor: '#3A2214', tipo: 'acompanhamento' },
]

export const NOMES_SUGERIDOS = ['Especial da Geo', 'Combo Rubro-Negro', 'Sushi do Vale', 'Uramaki da Dra. Geo', 'Edição de 25 Anos', 'O Kimi Aprova']

export interface Bebida {
  id: string
  nome: string
  cor: string
  resposta: string
}

// Todas viram Coca Zero. É a piada.
export const BEBIDAS: Bebida[] = [
  { id: 'coca-zero', nome: 'Coca Zero', cor: '#2B1B12', resposta: 'Excelente escolha. A única escolha, na verdade.' },
  { id: 'saque', nome: 'Saquê', cor: '#F4F1E8', resposta: 'Saquê acabou. Trouxe uma Coca Zero.' },
  { id: 'cha-verde', nome: 'Chá verde', cor: '#B5D88A', resposta: 'O chá verde ficou preto e borbulhante. Estranho… é Coca Zero.' },
  { id: 'suco', nome: 'Suco de laranja', cor: '#F5A623', resposta: 'A laranja não veio trabalhar hoje. Coca Zero!' },
  { id: 'agua', nome: 'Água com gás', cor: '#CDEBF5', resposta: 'Água com gás… e com cor, e com sabor. Coca Zero.' },
  { id: 'vinho', nome: 'Vinho', cor: '#7A1F3D', resposta: 'O sommelier recomenda: Coca Zero, safra 2026.' },
  { id: 'cerveja', nome: 'Cerveja', cor: '#F2C14E', resposta: 'O Shane bebeu todas. Sobrou Coca Zero.' },
  { id: 'coca-normal', nome: 'Coca normal', cor: '#2B1B12', resposta: 'Coca normal?! Nesta casa, não. Coca Zero.' },
]
