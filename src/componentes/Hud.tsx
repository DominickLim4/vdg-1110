import { useProgresso } from '../estado/progresso'
import { irPara } from '../estado/rota'
import { definirSom, som } from './som'
import { Sprite } from './Sprite'
import './hud.css'

const DIAS = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.']

export function estrelasTotais(p: ReturnType<typeof useProgresso>['p']) {
  const vales = Object.keys(p.vales).length * 5
  const pesca = p.pesca.finalizado ? { prata: 5, ouro: 10, iridio: 15 }[p.pesca.finalizado.faixa] : 0
  return vales + pesca + Object.keys(p.conquistas).length
}

export function Hud() {
  const { p, atualizar } = useProgresso()
  const hoje = new Date()
  const alternarSom = () => {
    const ativo = !p.som
    definirSom(ativo)
    atualizar((s) => ({ ...s, som: ativo }))
    if (ativo) som.toque()
  }
  return (
    <header className="hud">
      <div className="hud__botoes">
        <button className="hud__parquinho" aria-label="Parquinho: minijogos e brinquedos" onClick={() => irPara('parquinho')}>
          <span className="hud__botao hud__botao--parquinho moldura">
            <Sprite nome="d20" escala={2} />
          </span>
          <span className="hud__botao-rotulo">Parquinho</span>
        </button>
        <button className="hud__botao moldura" aria-label={p.som ? 'Desligar som' : 'Ligar som'} onClick={alternarSom}>
          <span className={`hud__som ${p.som ? '' : 'hud__som--mudo'}`} aria-hidden>
            ♪
          </span>
        </button>
      </div>

      <div className="hud__relogio moldura">
        <div className="hud__data">
          <span>
            {DIAS[hoje.getDay()]} {hoje.getDate()}
          </span>
          <Sprite nome="folha" escala={2} />
        </div>
        <div className="hud__estrelas afundado" title="Estrelas conquistadas">
          <Sprite nome="estrela" variacao="ouro" escala={1.5} />
          <span>{estrelasTotais(p)}</span>
        </div>
      </div>

      <div className="hud__energia moldura" title="Energia (Coca Zero)" aria-label={`Energia ${p.energia}%`}>
        <span className="hud__energia-letra">E</span>
        <div className="hud__energia-tubo afundado">
          <div className="hud__energia-nivel" style={{ height: `${p.energia}%` }} />
        </div>
      </div>
    </header>
  )
}
