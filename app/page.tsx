"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const WORKOUTS = {
  "Segunda — Upper A": {
    day: "Segunda",
    label: "Upper A",
    color: "#3b82f6",
    exercises: [
      { id: "ua1", name: "Supino Inclinado Máquina", type: "Composto", muscle: "Peito Superior", secondary: ["Ombro", "Tríceps"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Movimento composto que recruta fortemente o feixe superior do peitoral com menor stress no ombro comparado à barra.", repDesc: "Faixa de 6–9 reps ideal para ganho de força e hipertrofia em compostos. Cargas mais pesadas com volume baixo maximizam o sinal anabólico." },
      { id: "ua2", name: "Supino Reto", type: "Composto", muscle: "Peito", secondary: ["Ombro Anterior", "Tríceps"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Exercício base para desenvolvimento do peitoral. Recrutamento máximo do peito com carga progressiva.", repDesc: "Mesma lógica dos compostos: faixa de força-hipertrofia, eficiente para progressão dupla." },
      { id: "ua3", name: "Puxada Alta Aberta", type: "Composto", muscle: "Costas/Latíssimo", secondary: ["Bíceps", "Romboides"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Movimento de puxada vertical que desenvolve largura das costas. Pegada aberta enfatiza o latíssimo.", repDesc: "Faixa de força com volume controlado. Permite carga progressiva e sobrecarga mecânica eficiente." },
      { id: "ua4", name: "Remada Baixa Neutra", type: "Composto", muscle: "Costas/Espessura", secondary: ["Bíceps", "Posterior Ombro"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Remada horizontal que desenvolve espessura das costas, romboides e trapézio médio.", repDesc: "Compostos horizontais respondem bem à faixa de força. Facilita progressão consistente." },
      { id: "ua5", name: "Elevação Lateral", type: "Isolador", muscle: "Ombro Lateral", secondary: ["Trapézio"], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Isolador do deltoide médio. Responsável pela largura dos ombros e aparência em V.", repDesc: "Isoladores de ombro respondem bem a repetições mais altas. Foco na conexão mente-músculo." },
      { id: "ua6", name: "Scott", type: "Isolador", muscle: "Bíceps", secondary: ["Braquial"], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Rosca scott isola o bíceps ao remover o balanço do corpo. Excelente para pico do bíceps.", repDesc: "Isoladores de braço: faixa moderada de reps com foco em pump e conexão neuromuscular." },
      { id: "ua7", name: "Tríceps Francês", type: "Isolador", muscle: "Tríceps Cabeça Longa", secondary: [], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Alongamento máximo da cabeça longa do tríceps. Fundamental para tamanho do braço.", repDesc: "Cabeça longa responde ao alongamento. Faixa moderada maximiza hipertrofia por tensão." },
      { id: "ua8", name: "Peck Deck Invertido", type: "Isolador", muscle: "Posterior de Ombro", secondary: ["Romboides"], sets: 2, repRange: [12, 15], rest: "2 min", rir: false, desc: "Isolador do deltoide posterior. Essencial para equilíbrio articular e aparência 3D dos ombros.", repDesc: "Músculo pequeno que responde bem a reps altas e burn. Faixa de 12–15 para volume suficiente." },
    ],
  },
  "Terça — Lower A": {
    day: "Terça",
    label: "Lower A",
    color: "#10b981",
    exercises: [
      { id: "la1", name: "Agachamento Smith", type: "Composto", muscle: "Quadríceps/Glúteo", secondary: ["Posterior", "Core"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Agachamento guiado que permite foco total nos membros inferiores sem preocupação com equilíbrio.", repDesc: "Composto base de lower. Faixa de força para máxima sobrecarga progressiva." },
      { id: "la2", name: "Extensora", type: "Isolador", muscle: "Quadríceps", secondary: [], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Isolador do quadríceps em cadeia cinética aberta. Complementa o agachamento com tensão direta.", repDesc: "Quadríceps respondem bem a reps moderadas em isoladores. Boa para bombeamento e detalhe." },
      { id: "la3", name: "Stiff", type: "Composto", muscle: "Posterior/Glúteo", secondary: ["Eretores"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Movimento de dobradiça do quadril que desenvolve posterior e glúteo com ênfase no alongamento.", repDesc: "Composto de posterior: faixa de força para carga progressiva e tensão mecânica máxima." },
      { id: "la4", name: "Mesa Flexora", type: "Isolador", muscle: "Posterior", secondary: [], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Isolador dos isquiotibiais em posição encurtada. Complementa o stiff para cobertura total.", repDesc: "Isoladores de posterior respondem bem a reps moderadas. Complemento essencial ao composto." },
      { id: "la5", name: "Panturrilha", type: "Isolador", muscle: "Panturrilha", secondary: [], sets: 2, repRange: [12, 15], rest: "90 seg", rir: false, desc: "Treinamento direto do sóleo e gastrocnêmio. Frequência e amplitude são fundamentais.", repDesc: "Panturrilha suporta alto volume. Faixa moderada-alta com amplitude total." },
      { id: "la6", name: "Abdômen", type: "Isolador", muscle: "Core", secondary: [], sets: 2, repRange: [12, 20], rest: "90 seg", rir: false, desc: "Trabalho direto do reto abdominal e oblíquos para força e estabilidade do core.", repDesc: "Abdômen tolera alto volume e reps. Faixa ampla para ajustar à forma do exercício escolhido." },
    ],
  },
  "Quarta — Upper B": {
    day: "Quarta",
    label: "Upper B",
    color: "#8b5cf6",
    exercises: [
      { id: "ub1", name: "Barra Fixa / Puxada Neutra", type: "Composto", muscle: "Costas", secondary: ["Bíceps", "Core"], sets: 2, repRange: [6, 10], rest: "3–5 min", rir: true, desc: "Rei dos exercícios de costas. Recruta toda a musculatura das costas com peso corporal ou lastro.", repDesc: "Faixa ligeiramente mais alta que outros compostos por ser com peso corporal ou puxada." },
      { id: "ub2", name: "Remada Articulada", type: "Composto", muscle: "Costas", secondary: ["Bíceps", "Romboides"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Remada com barra T ou máquina articulada. Excelente para espessura e carga progressiva.", repDesc: "Composto horizontal fundamental. Faixa de força para sobrecarga máxima." },
      { id: "ub3", name: "Pulldown", type: "Isolador", muscle: "Latíssimo", secondary: ["Bíceps"], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Pulldown focado no latíssimo com amplitude controlada. Complemento ao movimento de barra.", repDesc: "Isolador de costas: reps moderadas para pump e bombeamento do lat." },
      { id: "ub4", name: "Crucifixo Máquina", type: "Isolador", muscle: "Peito", secondary: [], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Isolador de peito que mantém tensão constante. Excelente para detalhe e pump.", repDesc: "Isolador com tensão constante responde bem a reps moderadas. Foco na contração do peitoral." },
      { id: "ub5", name: "Graviton / Paralela", type: "Composto", muscle: "Peito/Tríceps", secondary: ["Ombro Anterior"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Paralela com inclinação para frente. Recruta peito inferior e tríceps com grande amplitude.", repDesc: "Composto para peito inferior. Faixa de força para progressão com carga ou assistência." },
      { id: "ub6", name: "Elevação Lateral", type: "Isolador", muscle: "Ombro Lateral", secondary: [], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Segunda sessão semanal de elevação lateral para máxima frequência do deltoide médio.", repDesc: "Alta frequência beneficia deltoides. Segunda exposição semanal com faixa de hipertrofia." },
      { id: "ub7", name: "Martelo", type: "Isolador", muscle: "Braquial/Braquiorradial", secondary: ["Bíceps"], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Rosca neutra que desenvolve o braquial e braquiorradial. Contribui muito para tamanho do braço.", repDesc: "Muscles do antebraço e braquial respondem bem a faixa moderada. Complemento ao scott." },
      { id: "ub8", name: "Pushdown", type: "Isolador", muscle: "Tríceps", secondary: [], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Isolador de tríceps com corda ou barra. Trabalha principalmente as cabeças lateral e medial.", repDesc: "Complemento ao tríceps francês. Faixa moderada para pump e detalhe." },
    ],
  },
  "Quinta — Lower B": {
    day: "Quinta",
    label: "Lower B",
    color: "#f59e0b",
    exercises: [
      { id: "lb1", name: "Terra Romeno / Stiff", type: "Composto", muscle: "Posterior/Glúteo", secondary: ["Eretores"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Variação do levantamento terra com ênfase no posterior e glúteo. Excelente para força e massa.", repDesc: "Composto base de posterior. Faixa de força para sobrecarga progressiva máxima." },
      { id: "lb2", name: "Mesa Flexora", type: "Isolador", muscle: "Posterior", secondary: [], sets: 2, repRange: [10, 15], rest: "2–3 min", rir: false, desc: "Segunda exposição semanal dos isquiotibiais para frequência ótima de treinamento.", repDesc: "Alta frequência beneficia isquiotibiais. Isolador complementar ao composto." },
      { id: "lb3", name: "Hack Squat", type: "Composto", muscle: "Quadríceps", secondary: ["Glúteo"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Agachamento em máquina com ênfase nos quadríceps. Permite alta carga com menor stress na coluna.", repDesc: "Composto de quadríceps com boa sobrecarga mecânica na faixa de força." },
      { id: "lb4", name: "Afundo / Búlgaro", type: "Composto", muscle: "Quadríceps/Glúteo", secondary: ["Posterior", "Core"], sets: 2, repRange: [8, 10], rest: "3 min", rir: true, desc: "Agachamento unilateral que desenvolve força, equilíbrio e hipertrofia de forma assimétrica.", repDesc: "Faixa ligeiramente mais alta pela natureza unilateral. Excelente para corrigir desequilíbrios." },
      { id: "lb5", name: "Panturrilha", type: "Isolador", muscle: "Panturrilha", secondary: [], sets: 2, repRange: [12, 15], rest: "90 seg", rir: false, desc: "Segunda sessão de panturrilha da semana para frequência ótima.", repDesc: "Panturrilha suporta alta frequência. Sessão complementar para máximo desenvolvimento." },
      { id: "lb6", name: "Abdômen", type: "Isolador", muscle: "Core", secondary: [], sets: 2, repRange: [12, 20], rest: "90 seg", rir: false, desc: "Segunda sessão de core para frequência e volume adequados.", repDesc: "Core tolera alta frequência. Segunda exposição semanal para desenvolvimento." },
    ],
  },
  "Sexta — Upper C": {
    day: "Sexta",
    label: "Upper C",
    color: "#ef4444",
    exercises: [
      { id: "uc1", name: "Supino Inclinado Máquina", type: "Composto", muscle: "Peito Superior", secondary: ["Ombro", "Tríceps"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Terceira exposição do peito superior na semana. Alta frequência para máximo estímulo.", repDesc: "Composto de peito com alta frequência. Faixa de força para progressão contínua." },
      { id: "uc2", name: "Puxada Alta", type: "Composto", muscle: "Costas/Latíssimo", secondary: ["Bíceps"], sets: 2, repRange: [6, 9], rest: "3–5 min", rir: true, desc: "Terceira exposição de costas da semana. Mantém frequência elevada para o latíssimo.", repDesc: "Alta frequência de puxada vertical. Faixa de força para máxima sobrecarga." },
      { id: "uc3", name: "Elevação Lateral", type: "Isolador", muscle: "Ombro Lateral", secondary: [], sets: 3, repRange: [12, 15], rest: "90 seg", rir: false, desc: "Terceira sessão e com maior volume (3 séries). Ombros toleram alta frequência e volume.", repDesc: "Sessão de volume maior para deltoides. 3 séries com faixa mais alta para pump máximo." },
      { id: "uc4", name: "Peck Deck Invertido", type: "Isolador", muscle: "Posterior de Ombro", secondary: [], sets: 2, repRange: [12, 15], rest: "2 min", rir: false, desc: "Segunda exposição do posterior de ombro. Frequência dupla para músculo muitas vezes negligenciado.", repDesc: "Alta frequência para posterior de ombro. Faixa alta para pump e volume." },
      { id: "uc5", name: "Scott", type: "Isolador", muscle: "Bíceps", secondary: [], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Segunda exposição de bíceps na semana. Frequência dupla para máximo desenvolvimento.", repDesc: "Segunda sessão de bíceps. Faixa moderada-alta para volume e hipertrofia." },
      { id: "uc6", name: "Tríceps Corda", type: "Isolador", muscle: "Tríceps", secondary: [], sets: 2, repRange: [10, 15], rest: "2 min", rir: false, desc: "Tríceps corda com abertura na fase final. Excelente para separação e detalhe das cabeças.", repDesc: "Segundo isolador de tríceps da semana. Faixa moderada para pump e hipertrofia." },
    ],
  },
};

const EDUCATION = [
  { icon: "🧠", title: "SNC — Sistema Nervoso Central", content: "O SNC é responsável por coordenar todas as contrações musculares. Treinos intensos com compostos pesados causam fadiga do SNC que vai além da fadiga muscular local. Por isso, o low volume é crucial: treinar com alta intensidade sem acumular volume excessivo preserva o SNC e permite recuperação completa entre sessões." },
  { icon: "🎯", title: "RIR — Reps in Reserve", content: "RIR significa quantas repetições você poderia fazer além das que fez. RIR 0 = falha total. RIR 1 = parou com 1 rep sobrando. Treinar com 1–2 RIR nas primeiras séries maximiza o estímulo enquanto controla a fadiga. A última série pode ir à falha real para garantir recrutamento máximo de fibras." },
  { icon: "💥", title: "Falha Muscular", content: "Falha ocorre quando não é possível completar mais uma repetição com boa execução. Ir à falha em toda série é desnecessário e contra-produtivo. Neste programa: 1ª série = 1 RIR (uma rep sobrando), 2ª série = falha. Isso garante estímulo máximo sem fadiga excessiva que comprometa o progresso a longo prazo." },
  { icon: "🏋️", title: "Compostos vs Isoladores", content: "Compostos recrutam múltiplos músculos e articulações (supino, agachamento, terra). São a base do programa por permitirem maior carga e progressão. Isoladores trabalham um músculo específico (scott, extensora, elevação lateral). Complementam os compostos adicionando volume direto onde necessário, com menor custo neural." },
  { icon: "📈", title: "Progressão Dupla", content: "O sistema mais eficiente para iniciantes e intermediários. Funciona em duas etapas: 1) Progride em reps dentro da faixa alvo. 2) Quando atinge o topo da faixa, aumenta a carga e volta ao fundo. Exemplo: semana 1 faz 6 reps com 30kg, semana 4 faz 9 reps com 30kg → próxima sessão: 32.5kg x 6. Simples, mensurável e eficaz." },
  { icon: "💪", title: "Hipertrofia Natural", content: "Sem uso de anabolizantes, o músculo cresce através de tensão mecânica, dano muscular e estresse metabólico. Naturais precisam de: boa recuperação, sono de qualidade, superávit calórico, alta intensidade com volume controlado. O programa é desenhado especificamente para naturais: baixo volume, alta intensidade, progressão sistemática." },
  { icon: "🔬", title: "Low Volume", content: "Evidências mostram que a maioria dos ganhos vem das primeiras séries efetivas. Mais volume não significa mais resultados — para naturais, frequentemente significa recuperação incompleta. 2 séries efetivas por exercício, executadas com alta intensidade até próximo da falha, são suficientes para máximo estímulo hipertrófico." },
  { icon: "⏱️", title: "Descanso Ideal", content: "Compostos pesados precisam de 3–5 minutos entre séries para restaurar ATP e fosfato de creatina. Reduzir o descanso compromete a performance da próxima série e a progressão de carga. Isoladores podem usar 90–120 segundos. O timer automático do app garante que você descanse o tempo ideal automaticamente." },
  { icon: "😴", title: "Importância do Sono", content: "A maior parte da síntese proteica e liberação de GH (hormônio do crescimento) ocorre durante o sono profundo. Dormir menos de 7 horas reduz significativamente a taxa de síntese proteica e aumenta o catabolismo. 8–9 horas é o ideal para maximizar resultados. Sem sono adequado, todo o treinamento e nutrição são comprometidos." },
  { icon: "🍽️", title: "Superávit Calórico", content: "Para construir músculo, o corpo precisa de energia excedente — mais calorias do que gasta. Superávit de 200–400kcal diários é ideal para naturais: suficiente para crescimento sem ganho excessivo de gordura. Proteína: 1.6–2.2g por kg de peso corporal. Sem combustível adequado, o treino perfeito produz resultados mínimos." },
];

const DAYS = ["Segunda — Upper A", "Terça — Lower A", "Quarta — Upper B", "Quinta — Lower B", "Sexta — Upper C"];

function getToday() {
  const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
  const d = new Date().getDay();
  return map[d as keyof typeof map] !== undefined
  ? DAYS[map[d as keyof typeof map]]
  : DAYS[0];
}

// ─── ICONS (inline SVG via lucide-style) ─────────────────────────────────────

const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    dumbbell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 5v14"/><path d="M18 5v14"/><path d="M6 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"/><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 8h12"/><path d="M6 16h12"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="8 21 12 17 16 21"/><path d="M5 3H19V7C19 9.76142 16.7614 12 14 12H10C7.23858 12 5 9.76142 5 7V3Z"/><path d="M5 5H2V7C2 9.20914 3.79086 11 6 11"/><path d="M19 5H22V7C22 9.20914 20.2091 11 18 11"/><line x1="12" y1="12" x2="12" y2="17"/></svg>,
    scale: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>,
    timer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2h4"/><path d="M12 14v-4"/><circle cx="12" cy="14" r="8"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    arrow_up: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>,
    flame: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    notes: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  };
  return icons[name] || null;
};

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── MINI LINE CHART ─────────────────────────────────────────────────────────

function MiniChart({ data, color = "#3b82f6", height = 60, showDots = true }) {
  if (!data || data.length < 2) return (
    <div className="flex items-center justify-center h-16 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Sem dados</div>
  );
  const vals = data.map(d => typeof d === "object" ? d.y : d);
  const min = Math.min(...vals); const max = Math.max(...vals);
  const range = max - min || 1;
  const w = 200; const h = height;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={[...pts, `${w},${h}`, `0,${h}`].join(" ")} fill={`url(#grad-${color.replace("#","")})`} stroke="none"/>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {showDots && vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#111" strokeWidth="1.5"/>;
      })}
    </svg>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────

function RestTimer({ seconds, onClose }) {
  const [remaining, setRemaining] = useState(seconds);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) { setActive(false); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, active]);
  const pct = ((seconds - remaining) / seconds) * 100;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 24, padding: "2.5rem", textAlign: "center", minWidth: 280 }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 24, letterSpacing: "0.1em", textTransform: "uppercase" }}>Descansando</div>
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 24px" }}>
          <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#222" strokeWidth="8"/>
            <circle cx="80" cy="80" r="70" fill="none" stroke={remaining <= 10 ? "#ef4444" : "#3b82f6"} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 42, fontWeight: 800, color: remaining <= 10 ? "#ef4444" : "#fff", fontVariantNumeric: "tabular-nums" }}>
              {m}:{s.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
        {remaining <= 0 && <div style={{ color: "#10b981", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>✓ Descanso concluído!</div>}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setActive(a => !a)} style={{ padding: "10px 20px", borderRadius: 10, background: "#222", border: "1px solid #333", color: "#fff", cursor: "pointer", fontSize: 13 }}>
            {active ? "Pausar" : "Retomar"}
          </button>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, background: "#3b82f6", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EXERCISE MODAL ───────────────────────────────────────────────────────────

function ExerciseModal({ exercise, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111", border: "1px solid #222", borderRadius: 20, padding: "1.5rem", maxWidth: 440, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: exercise.type === "Composto" ? "#3b82f6" : "#8b5cf6", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{exercise.type}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{exercise.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: 6, color: "#888", cursor: "pointer" }}><Icon name="x" size={16}/></button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#aaa" }}>🎯 {exercise.muscle}</span>
          <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#aaa" }}>📊 {exercise.repRange[0]}–{exercise.repRange[1]} reps</span>
          <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#aaa" }}>⏱ {exercise.rest}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Sobre o exercício</div>
          <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{exercise.desc}</div>
        </div>
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Por que essa faixa de reps?</div>
          <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>{exercise.repDesc}</div>
        </div>
        {exercise.rir && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, fontSize: 12, color: "#ef9999" }}>
            <strong>Indicador de falha:</strong> 1ª série = 1 RIR • 2ª série = Falha
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────

function WorkoutPage({ dayKey, history, setHistory }) {
  const workout = WORKOUTS[dayKey];
  const today = new Date().toISOString().split("T")[0];
  const sessionKey = `${today}-${dayKey}`;
  const [sets, setSets] = useState(() => load(`sets-${sessionKey}`, {}));
  const [completed, setCompleted] = useState(() => load(`completed-${sessionKey}`, {}));
  const [notes, setNotes] = useState(() => load(`notes-${sessionKey}`, {}));
  const [timer, setTimer] = useState(null);
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { save(`sets-${sessionKey}`, sets); }, [sets, sessionKey]);
  useEffect(() => { save(`completed-${sessionKey}`, completed); }, [completed, sessionKey]);
  useEffect(() => { save(`notes-${sessionKey}`, notes); }, [notes, sessionKey]);

  const getSetData = (exId, setIdx) => sets[exId]?.[setIdx] || { weight: "", reps: "" };
  const updateSet = (exId, setIdx, field, val) => {
    setSets(prev => ({ ...prev, [exId]: { ...prev[exId], [setIdx]: { ...getSetData(exId, setIdx), [field]: val } } }));
  };
  const toggleComplete = (exId, setIdx, rest) => {
    const key = `${exId}-${setIdx}`;
    const wasCompleted = completed[key];
    setCompleted(prev => ({ ...prev, [key]: !wasCompleted }));
    if (!wasCompleted) {
      const restSecs = rest?.includes("3–5") ? 210 : rest?.includes("2–3") ? 150 : 90;
      setTimer(restSecs);
    }
  };
  const isComplete = (exId, setIdx) => !!completed[`${exId}-${setIdx}`];
  const allDone = workout.exercises.every(ex => Array.from({ length: ex.sets }, (_, i) => isComplete(ex.id, i)).every(Boolean));

  const saveWorkout = () => {
    const entry = {
      date: today, dayKey, sessionKey,
      sets: Object.fromEntries(
        workout.exercises.map(ex => [ex.id, Array.from({ length: ex.sets }, (_, i) => getSetData(ex.id, i))])
      ),
    };
    setHistory(prev => {
      const filtered = prev.filter(h => h.sessionKey !== sessionKey);
      return [...filtered, entry];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const progressSuggestion = (ex) => {
    const exHistory = history.filter(h => h.dayKey === dayKey && h.sets?.[ex.id]);
    if (exHistory.length < 2) return null;
    const last = exHistory[exHistory.length - 1].sets[ex.id];
    const atTop = last?.every(s => parseInt(s.reps) >= ex.repRange[1]);
    if (atTop) return `🎯 Você atingiu o topo da faixa no treino anterior. Aumente a carga!`;
    return null;
  };

  return (
    <div>
      {timer && <RestTimer seconds={timer} onClose={() => setTimer(null)}/>}
      {modal && <ExerciseModal exercise={modal} onClose={() => setModal(null)}/>}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Treino de hoje</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0 }}>{workout.label}</h1>
          <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: workout.color + "22", color: workout.color, border: `1px solid ${workout.color}44` }}>{workout.day}</span>
        </div>
        <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{workout.exercises.length} exercícios • {workout.exercises.reduce((a, e) => a + e.sets, 0)} séries totais</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {workout.exercises.map(ex => {
          const suggestion = progressSuggestion(ex);
          const exDone = Array.from({ length: ex.sets }, (_, i) => isComplete(ex.id, i)).every(Boolean);
          return (
            <div key={ex.id} style={{ background: "#0d0d0d", border: `1px solid ${exDone ? "#10b98133" : "#1a1a1a"}`, borderRadius: 16, padding: "16px 18px", transition: "border-color 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: ex.type === "Composto" ? "#3b82f622" : "#8b5cf622", color: ex.type === "Composto" ? "#3b82f6" : "#8b5cf6" }}>{ex.type}</span>
                    {exDone && <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>✓ Concluído</span>}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>🎯 {ex.muscle} • {ex.repRange[0]}–{ex.repRange[1]} reps • ⏱ {ex.rest}</div>
                </div>
                <button onClick={() => setModal(ex)} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 6, color: "#555", cursor: "pointer", flexShrink: 0 }}>
                  <Icon name="info" size={14}/>
                </button>
              </div>

              {suggestion && (
                <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, fontSize: 12, color: "#93c5fd", marginBottom: 12 }}>{suggestion}</div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.from({ length: ex.sets }, (_, si) => {
                  const sd = getSetData(ex.id, si);
                  const done = isComplete(ex.id, si);
                  return (
                    <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: done ? "#0f1a14" : "#111", border: `1px solid ${done ? "#10b98133" : "#1e1e1e"}`, borderRadius: 10, transition: "all 0.2s" }}>
                      <div style={{ fontSize: 11, color: "#444", fontWeight: 700, width: 20, flexShrink: 0 }}>{si + 1}</div>
                      {ex.rir && <div style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, background: si === 0 ? "#f59e0b22" : "#ef444422", color: si === 0 ? "#f59e0b" : "#ef4444", fontWeight: 700, flexShrink: 0 }}>{si === 0 ? "1 RIR" : "FALHA"}</div>}
                      <input value={sd.weight} onChange={e => updateSet(ex.id, si, "weight", e.target.value)} placeholder="kg" style={{ width: 60, padding: "6px 8px", background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 13, textAlign: "center", outline: "none" }}/>
                      <span style={{ color: "#333", fontSize: 12 }}>×</span>
                      <input value={sd.reps} onChange={e => updateSet(ex.id, si, "reps", e.target.value)} placeholder="reps" style={{ width: 60, padding: "6px 8px", background: "#0d0d0d", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 13, textAlign: "center", outline: "none" }}/>
                      <button onClick={() => toggleComplete(ex.id, si, ex.rest)} style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 8, border: `1px solid ${done ? "#10b981" : "#2a2a2a"}`, background: done ? "#10b981" : "transparent", color: done ? "#fff" : "#444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        <Icon name="check" size={14}/>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 12 }}>
                <input value={notes[ex.id] || ""} onChange={e => setNotes(prev => ({ ...prev, [ex.id]: e.target.value }))} placeholder="Notas (execução, sensações...)" style={{ width: "100%", padding: "8px 12px", background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, color: "#888", fontSize: 12, outline: "none", boxSizing: "border-box" }}/>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={saveWorkout} style={{ flex: 1, padding: "14px", borderRadius: 14, background: saved ? "#10b981" : "#3b82f6", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "background 0.3s" }}>
          {saved ? "✓ Treino Salvo!" : "Salvar Treino"}
        </button>
      </div>
    </div>
  );
}

// ─── PROGRESSION PAGE ─────────────────────────────────────────────────────────

function ProgressionPage({ history }) {
  const [selected, setSelected] = useState(DAYS[0]);
  const workout = WORKOUTS[selected];

  const getExHistory = (exId) => {
    return history
      .filter(h => h.dayKey === selected && h.sets?.[exId])
      .map(h => ({ date: h.date, sets: h.sets[exId] }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getStatus = (ex) => {
    const hist = getExHistory(ex.id);
    if (hist.length < 1) return { label: "Sem dados", color: "#555" };
    const last = hist[hist.length - 1].sets;
    const atTop = last.every(s => parseInt(s.reps) >= ex.repRange[1]);
    if (atTop) return { label: "Pronto ↑", color: "#10b981" };
    if (hist.length >= 3) {
      const prev2 = hist.slice(-3).map(h => h.sets.reduce((a, s) => a + (parseInt(s.reps) || 0), 0));
      if (prev2[0] === prev2[2]) return { label: "Estagnado", color: "#f59e0b" };
    }
    return { label: "Progredindo", color: "#3b82f6" };
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>Progressão</h1>
        <div style={{ fontSize: 13, color: "#555" }}>Acompanhe a evolução de cada exercício</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setSelected(d)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${selected === d ? WORKOUTS[d].color : "#222"}`, background: selected === d ? WORKOUTS[d].color + "22" : "transparent", color: selected === d ? WORKOUTS[d].color : "#555", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
            {WORKOUTS[d].label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workout.exercises.map(ex => {
          const hist = getExHistory(ex.id);
          const status = getStatus(ex);
          const chartData = hist.flatMap(h => h.sets.map(s => parseFloat(s.weight) || 0)).filter(Boolean);
          const repsData = hist.flatMap(h => h.sets.map(s => parseInt(s.reps) || 0)).filter(Boolean);
          const maxWeight = hist.length ? Math.max(...hist.flatMap(h => h.sets.map(s => parseFloat(s.weight) || 0))) : 0;
          const maxReps = hist.length ? Math.max(...hist.flatMap(h => h.sets.map(s => parseInt(s.reps) || 0))) : 0;

          return (
            <div key={ex.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ex.muscle} • {ex.repRange[0]}–{ex.repRange[1]} reps</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: 20, background: status.color + "22", color: status.color, fontSize: 11, fontWeight: 700, border: `1px solid ${status.color}44` }}>{status.label}</div>
              </div>
              {hist.length > 0 ? (
                <>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: "#111", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>PR Carga</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{maxWeight}kg</div>
                    </div>
                    <div style={{ flex: 1, background: "#111", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>PR Reps</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{maxReps}</div>
                    </div>
                    <div style={{ flex: 1, background: "#111", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Sessões</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{hist.length}</div>
                    </div>
                  </div>
                  {chartData.length >= 2 && (
                    <div style={{ background: "#111", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Evolução de carga</div>
                      <MiniChart data={chartData} color={WORKOUTS[selected].color} height={50}/>
                    </div>
                  )}
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                    {hist.slice(-4).reverse().map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: i === 0 ? "#aaa" : "#555" }}>
                        <span style={{ width: 80, flexShrink: 0 }}>{h.date}</span>
                        {h.sets.map((s, si) => s.weight || s.reps ? <span key={si} style={{ background: "#1a1a1a", borderRadius: 5, padding: "1px 6px" }}>{s.weight}kg × {s.reps}</span> : null)}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "#444", padding: "16px 0", textAlign: "center" }}>Sem histórico ainda. Complete seu primeiro treino!</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────

function HistoryPage({ history, setHistory }) {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>Histórico</h1>
        <div style={{ fontSize: 13, color: "#555" }}>{history.length} sessões registradas</div>
      </div>
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#444" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "#555" }}>Nenhum treino salvo</div>
          <div style={{ fontSize: 13 }}>Complete e salve seu primeiro treino para ver aqui.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((session, i) => {
            const workout = WORKOUTS[session.dayKey];
            if (!workout) return null;
            const isExp = expanded === i;
            return (
              <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 14 }}>
                <div onClick={() => setExpanded(isExp ? null : i)} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{workout.label}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{session.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ padding: "2px 10px", borderRadius: 10, background: workout.color + "22", color: workout.color, fontSize: 11, fontWeight: 700 }}>{workout.day}</span>
                    <Icon name="chevron" size={14} className="" style={{ transform: isExp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#555" }}/>
                  </div>
                </div>
                {isExp && (
                  <div style={{ borderTop: "1px solid #1a1a1a", padding: "14px 18px" }}>
                    {workout.exercises.map(ex => {
                      const exSets = session.sets?.[ex.id];
                      if (!exSets || exSets.every(s => !s.weight && !s.reps)) return null;
                      return (
                        <div key={ex.id} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 4 }}>{ex.name}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {exSets.map((s, si) => s.weight || s.reps ? (
                              <span key={si} style={{ fontSize: 12, background: "#1a1a1a", borderRadius: 6, padding: "3px 8px", color: "#777" }}>{s.weight}kg × {s.reps}</span>
                            ) : null)}
                          </div>
                        </div>
                      );
                    })}
                    <button onClick={() => { if (confirm("Deletar este registro?")) { setHistory(prev => prev.filter((_, hi) => sorted[i] !== prev.find(p => p.sessionKey === sorted[i].sessionKey) || hi !== prev.indexOf(sorted[i]))); } }} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 8, background: "transparent", border: "1px solid #2a2a2a", color: "#555", fontSize: 12, cursor: "pointer" }}>
                      Deletar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── EDUCATION PAGE ───────────────────────────────────────────────────────────

function EducationPage() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>Educação</h1>
        <div style={{ fontSize: 13, color: "#555" }}>Entenda os princípios do programa</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {EDUCATION.map((item, i) => (
          <div key={i} style={{ background: "#0d0d0d", border: `1px solid ${open === i ? "#3b82f655" : "#1a1a1a"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: open === i ? "#fff" : "#bbb" }}>{item.title}</span>
              </div>
              <div style={{ color: "#444", transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <Icon name="chevron" size={16}/>
              </div>
            </div>
            {open === i && (
              <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1a1a1a" }}>
                <div style={{ paddingTop: 14, fontSize: 13, color: "#999", lineHeight: 1.7 }}>{item.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BODY WEIGHT TRACKER ──────────────────────────────────────────────────────

function BodyWeightCard({ weights, setWeights }) {
  const [input, setInput] = useState("");
  const addWeight = () => {
    const v = parseFloat(input);
    if (!v) return;
    const today = new Date().toISOString().split("T")[0];
    setWeights(prev => [...prev.filter(w => w.date !== today), { date: today, weight: v }].sort((a, b) => a.date.localeCompare(b.date)));
    setInput("");
  };
  const last7 = weights.slice(-7);
  const avg = last7.length ? (last7.reduce((a, w) => a + w.weight, 0) / last7.length).toFixed(1) : null;
  const trend = last7.length >= 3 ? (last7[last7.length - 1].weight - last7[0].weight).toFixed(1) : null;

  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Peso Corporal</div>
          <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
            {avg && <><span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{avg}<span style={{ fontSize: 14, color: "#555" }}>kg</span></span><span style={{ fontSize: 13, color: trend > 0 ? "#ef4444" : "#10b981", fontWeight: 700 }}>{trend > 0 ? "+" : ""}{trend}kg</span></>}
            {!avg && <span style={{ fontSize: 15, color: "#444" }}>Sem dados</span>}
          </div>
        </div>
        <Icon name="scale" size={20} className="" style={{ color: "#555" }}/>
      </div>
      {last7.length >= 2 && <div style={{ marginBottom: 14 }}><MiniChart data={last7.map(w => w.weight)} color="#10b981" height={50}/></div>}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addWeight()} placeholder="kg hoje" style={{ flex: 1, padding: "8px 12px", background: "#111", border: "1px solid #222", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }}/>
        <button onClick={addWeight} style={{ padding: "8px 14px", borderRadius: 10, background: "#10b981", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>+</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard({ setPage, setActiveDay, history, weights, setWeights }) {
  const todayKey = getToday();
  const workout = WORKOUTS[todayKey];
  const today = new Date().toISOString().split("T")[0];

  // Status cards
  const allStatuses = DAYS.flatMap(dk => WORKOUTS[dk].exercises.map(ex => {
    const hist = history.filter(h => h.dayKey === dk && h.sets?.[ex.id]);
    if (!hist.length) return "nodata";
    const last = hist[hist.length - 1].sets[ex.id];
    const atTop = last.every(s => parseInt(s.reps) >= ex.repRange[1]);
    if (atTop) return "ready";
    if (hist.length >= 3) {
      const t = hist.slice(-3).map(h => h.sets[ex.id].reduce((a, s) => a + (parseInt(s.reps) || 0), 0));
      if (t[0] === t[2]) return "stagnant";
    }
    return "progressing";
  }));
  const progressing = allStatuses.filter(s => s === "progressing").length;
  const stagnant = allStatuses.filter(s => s === "stagnant").length;
  const ready = allStatuses.filter(s => s === "ready").length;

  // Smart insights
  const insights = [];
  DAYS.forEach(dk => WORKOUTS[dk].exercises.forEach(ex => {
    const hist = history.filter(h => h.dayKey === dk && h.sets?.[ex.id]);
    if (!hist.length) return;
    const last = hist[hist.length - 1].sets[ex.id];
    const atTop = last.every(s => parseInt(s.reps) >= ex.repRange[1]);
    if (atTop) insights.push({ type: "up", text: `${ex.name}: atingiu o topo da faixa. Aumente a carga!`, color: "#10b981" });
    if (hist.length >= 3) {
      const t = hist.slice(-3).map(h => h.sets[ex.id].reduce((a, s) => a + (parseInt(s.reps) || 0), 0));
      if (t[0] === t[2]) insights.push({ type: "warn", text: `${ex.name} está estagnado há 3+ sessões. Revise técnica ou variáveis.`, color: "#f59e0b" });
    }
  }));
  if (!insights.length) insights.push({ type: "info", text: "Salve seus treinos para receber insights personalizados de progressão.", color: "#3b82f6" });

  // Weekly volume by muscle
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
  const weekKey = weekStart.toISOString().split("T")[0];
  const weekHistory = history.filter(h => h.date >= weekKey);
  const muscleVolume = {};
  weekHistory.forEach(session => {
    const w = WORKOUTS[session.dayKey];
    if (!w) return;
    w.exercises.forEach(ex => {
      const m = ex.muscle.split("/")[0];
      muscleVolume[m] = (muscleVolume[m] || 0) + ex.sets;
    });
  });
  const weekSessions = weekHistory.length;
  const totalSets = Object.values(muscleVolume).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0 }}>Bom dia! 💪</h1>
      </div>

      {/* Today's workout */}
      <div onClick={() => { setActiveDay(todayKey); setPage("workout"); }} style={{ background: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)", border: `1px solid ${workout.color}33`, borderRadius: 18, padding: "20px", marginBottom: 16, cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: workout.color, opacity: 0.06 }}/>
        <div style={{ fontSize: 11, color: workout.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Treino de Hoje</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{workout.label}</div>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>{workout.exercises.length} exercícios • {workout.exercises.reduce((a, e) => a + e.sets, 0)} séries</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {workout.exercises.slice(0, 4).map(ex => (
            <span key={ex.id} style={{ padding: "3px 10px", borderRadius: 20, background: "#1a1a1a", fontSize: 11, color: "#666" }}>{ex.name.split(" ").slice(0, 2).join(" ")}</span>
          ))}
          {workout.exercises.length > 4 && <span style={{ padding: "3px 10px", borderRadius: 20, background: "#1a1a1a", fontSize: 11, color: "#444" }}>+{workout.exercises.length - 4}</span>}
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, color: workout.color, fontSize: 13, fontWeight: 700 }}>
          <Icon name="play" size={14}/> Iniciar treino
        </div>
      </div>

      {/* Status cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Progredindo", value: progressing, color: "#3b82f6", icon: "trending" },
          { label: "Estagnados", value: stagnant, color: "#f59e0b", icon: "flame" },
          { label: "Subir carga", value: ready, color: "#10b981", icon: "arrow_up" },
        ].map(c => (
          <div key={c.label} style={{ background: "#0d0d0d", border: `1px solid ${c.color}22`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ color: c.color, marginBottom: 6 }}><Icon name={c.icon} size={18}/></div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "18px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="zap" size={12}/> Insights
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.slice(0, 3).map((ins, i) => (
            <div key={i} style={{ padding: "10px 12px", background: ins.color + "0d", border: `1px solid ${ins.color}33`, borderRadius: 10, fontSize: 13, color: ins.color + "dd" }}>
              {ins.text}
            </div>
          ))}
        </div>
      </div>

      {/* Recovery */}
      <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "18px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Recuperação — últimos 7 dias</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "#111", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sessões</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 2 }}>{weekSessions}<span style={{ fontSize: 12, color: "#555" }}>/5</span></div>
          </div>
          <div style={{ background: "#111", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>Séries</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 2 }}>{totalSets}</div>
          </div>
        </div>
        {Object.keys(muscleVolume).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([m, v]) => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#666", width: 90, flexShrink: 0 }}>{m}</div>
                <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: "#3b82f6", width: `${Math.min(100, (v / 8) * 100)}%`, transition: "width 0.5s" }}/>
                </div>
                <div style={{ fontSize: 11, color: "#555", width: 28, textAlign: "right" }}>{v}s</div>
              </div>
            ))}
          </div>
        )}
        {!Object.keys(muscleVolume).length && <div style={{ fontSize: 13, color: "#444", textAlign: "center", padding: "10px 0" }}>Salve treinos para ver volume por músculo</div>}
      </div>

      {/* Week calendar */}
      <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "18px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Semana</div>
        <div style={{ display: "flex", gap: 8 }}>
          {DAYS.map(dk => {
            const w = WORKOUTS[dk];
            const done = history.some(h => h.dayKey === dk && h.date === today);
            const isToday = dk === todayKey;
            return (
              <div key={dk} onClick={() => { setActiveDay(dk); setPage("workout"); }} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12, background: isToday ? w.color + "22" : "#111", border: `1px solid ${isToday ? w.color + "55" : done ? "#10b98133" : "#1e1e1e"}`, cursor: "pointer" }}>
                <div style={{ fontSize: 10, color: isToday ? w.color : "#555", fontWeight: 700, marginBottom: 4 }}>{w.day.slice(0, 3).toUpperCase()}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: isToday ? w.color : done ? "#10b981" : "#444" }}>{w.label}</div>
                {done && <div style={{ marginTop: 3 }}>✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body weight */}
      <BodyWeightCard weights={weights} setWeights={setWeights}/>

      {/* PRs */}
      {history.length > 0 && (
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "18px", marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="trophy" size={12}/> Melhores PRs
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DAYS.flatMap(dk => WORKOUTS[dk].exercises.map(ex => {
              const exHist = history.filter(h => h.dayKey === dk && h.sets?.[ex.id]).flatMap(h => h.sets[ex.id]);
              const maxW = Math.max(...exHist.map(s => parseFloat(s.weight) || 0));
              return maxW > 0 ? { name: ex.name, weight: maxW } : null;
            })).filter(Boolean).sort((a, b) => b.weight - a.weight).slice(0, 5).map((pr, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#111", borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: "#aaa" }}>{pr.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>{pr.weight}kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [activeDay, setActiveDay] = useState(getToday());
  const [history, setHistory] = useState(() => load("workout-history", []));
  const [weights, setWeights] = useState(() => load("body-weights", []));

  useEffect(() => { save("workout-history", history); }, [history]);
  useEffect(() => { save("body-weights", weights); }, [weights]);

  const nav = [
    { id: "dashboard", icon: "home", label: "Dashboard" },
    { id: "workout", icon: "dumbbell", label: "Treino" },
    { id: "progression", icon: "trending", label: "Progressão" },
    { id: "history", icon: "calendar", label: "Histórico" },
    { id: "education", icon: "book", label: "Educação" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#fff", paddingBottom: 80 }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #333; }
        input:focus { border-color: #333 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        button:active { transform: scale(0.97); }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #111", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff" }}>Hypertrophy<span style={{ color: "#3b82f6" }}>OS</span></div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>Low Volume · Natural</div>
        </div>
        {page === "workout" && (
          <div style={{ display: "flex", gap: 8 }}>
            {DAYS.map(dk => (
              <button key={dk} onClick={() => setActiveDay(dk)} style={{ padding: "4px 10px", borderRadius: 8, border: `1px solid ${activeDay === dk ? WORKOUTS[dk].color : "#222"}`, background: activeDay === dk ? WORKOUTS[dk].color + "22" : "transparent", color: activeDay === dk ? WORKOUTS[dk].color : "#555", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                {WORKOUTS[dk].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>
        {page === "dashboard" && <Dashboard setPage={setPage} setActiveDay={setActiveDay} history={history} weights={weights} setWeights={setWeights}/>}
        {page === "workout" && <WorkoutPage dayKey={activeDay} history={history} setHistory={setHistory}/>}
        {page === "progression" && <ProgressionPage history={history}/>}
        {page === "history" && <HistoryPage history={history} setHistory={setHistory}/>}
        {page === "education" && <EducationPage/>}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,8,8,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid #111", display: "flex", zIndex: 50 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ flex: 1, padding: "10px 4px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", color: page === n.id ? "#3b82f6" : "#444", transition: "color 0.15s" }}>
            <Icon name={n.icon} size={20}/>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}