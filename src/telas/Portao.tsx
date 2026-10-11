import { motion, useAnimationControls } from 'motion/react'
import { useState } from 'react'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { useProgresso } from '../estado/progresso'
import { normalizar } from '../jogos/termo/regras'
import './portao.css'

const RESPOSTA = 'KIMINHOCA'

const ERROS = [
  'Resposta errada. Kimi ouviu e ficou magoado.',
  'Quase… mas não. Pensa em alguém de quatro patas.',
  'Errou de novo! Toca em "Dica", ninguém precisa saber.',
  'O vale continua trancado. O amor da sua vida late, sabia?',
]

export function Portao() {
  const { atualizar } = useProgresso()
  const [texto, setTexto] = useState('')
  const [dica, setDica] = useState(false)
  const [erros, setErros] = useState(0)
  const [certo, setCerto] = useState(false)
  const caixa = useAnimationControls()

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (normalizar(texto) === RESPOSTA) {
      som.vitoria()
      setCerto(true)
      setTimeout(
        () => atualizar((s) => ({ ...s, portaoAberto: true, conquistas: { ...s.conquistas, portao: new Date().toISOString() } })),
        1100,
      )
      return
    }
    som.erro()
    setErros((n) => n + 1)
    void caixa.start({ x: [0, -10, 10, -8, 8, -4, 0], transition: { duration: 0.4 } })
  }

  return (
    <motion.div className="portao" exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }}>
      <motion.h1
        className="portao__titulo titulo-jogo"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      >
        Vale da Geo
      </motion.h1>

      <motion.div
        className="portao__kimi"
        animate={certo ? { y: [0, -40, 0, -24, 0], rotate: [0, -8, 8, 0] } : { y: [0, -4, 0] }}
        transition={certo ? { duration: 0.9 } : { duration: 1.6, repeat: Infinity }}
      >
        <Sprite nome="kimi" escala={6} alt="Kimi, o golden" />
        {certo && (
          <motion.div className="portao__coracao" initial={{ y: 0, opacity: 0 }} animate={{ y: -40, opacity: [0, 1, 0] }} transition={{ duration: 1 }}>
            <Sprite nome="coracao" escala={4} />
          </motion.div>
        )}
      </motion.div>

      <motion.form animate={caixa} onSubmit={enviar} className="portao__caixa moldura sombra-pixel">
        <p className="portao__fala">
          {certo ? 'Acertou! O portão do vale está abrindo…' : 'Antes de entrar no vale, responda:'}
        </p>
        <label htmlFor="senha" className="portao__pergunta">
          Quem é o amor da sua vida?
        </label>
        <input
          id="senha"
          className="portao__input afundado"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Digite aqui…"
          disabled={certo}
        />
        {erros > 0 && !certo && (
          <p className="portao__erro" role="alert">
            {ERROS[(erros - 1) % ERROS.length]}
          </p>
        )}
        {dica && !certo && <p className="portao__dica">Dica: termina com "nhoca".</p>}
        <div className="portao__acoes">
          <button type="button" className="botao" onClick={() => setDica(true)} disabled={dica || certo}>
            Dica
          </button>
          <button type="submit" className="botao botao--verde" disabled={!texto.trim() || certo}>
            Entrar no vale
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
