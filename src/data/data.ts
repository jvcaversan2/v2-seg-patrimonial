export interface LocalEspecifico {
  id: string;
  nome: string;
  unidadeId?: string; // Relacionamento opcional com unidade
}

export interface Unidade {
  id: string;
  nome: string;
  codigo: string;
  lat: number;
  lng: number;
}

export interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  status: "active" | "warning" | "critical";
  unidadeId: string;
  lat: number;
  lng: number;
  data: string;
}

export const unidades: Unidade[] = [
  { id: "ara", nome: "ARA", codigo: "ARA", lat: -21.7946, lng: -48.1756 }, // Araraquara - SP
  { id: "cad", nome: "CAD", codigo: "CAD", lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro - RJ
  { id: "caj", nome: "CAJ", codigo: "CAJ", lat: -23.0949, lng: -46.555 }, // Cajamar - SP
  { id: "cat", nome: "CAT", codigo: "CAT", lat: -19.9183, lng: -43.9346 }, // Catalão - GO (substituído por BH)
  { id: "cig", nome: "CIG", codigo: "CIG", lat: -23.5505, lng: -46.6333 }, // São Paulo - SP
  { id: "ciu", nome: "CIU", codigo: "CIU", lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro - RJ
  { id: "cma", nome: "CMA", codigo: "CMA", lat: -19.8157, lng: -43.9542 }, // Contagem - MG
  { id: "cmc", nome: "CMC", codigo: "CMC", lat: -10.9472, lng: -37.0731 }, // Carmópolis - SE
  {
    id: "cmc_mist",
    nome: "CMC MIST",
    codigo: "CMC_MIST",
    lat: -10.94,
    lng: -37.08,
  }, // Carmópolis - SE
  { id: "cmmm", nome: "CMMM", codigo: "CMMM", lat: -17.5698, lng: -39.7416 }, // Mucuri - BA
  { id: "cmp", nome: "CMP", codigo: "CMP", lat: -22.1216, lng: -51.3883 }, // Presidente Prudente - SP
  { id: "cmt", nome: "CMT", codigo: "CMT", lat: -19.9792, lng: -44.0121 }, // Betim - MG
  { id: "ctv", nome: "CTV", codigo: "CTV", lat: -15.6014, lng: -56.0979 }, // Cuiabá - MT
  { id: "cub", nome: "CUB", codigo: "CUB", lat: -22.6481, lng: -47.2016 }, // Cubatão - SP
  { id: "fpr", nome: "FPR", codigo: "FPR", lat: -25.4284, lng: -49.2733 }, // Curitiba - PR
  { id: "fpt", nome: "FPT", codigo: "FPT", lat: -23.5505, lng: -46.6333 }, // São Paulo - SP
  { id: "pra_i", nome: "PRÁ I", codigo: "PRÁ I", lat: -12.9718, lng: -38.5011 }, // Salvador - BA
  {
    id: "pra_ii",
    nome: "PRÁ II",
    codigo: "PRÁ II",
    lat: -12.9777,
    lng: -38.5016,
  }, // Salvador - BA
  { id: "rgd", nome: "RGD", codigo: "RGD", lat: -19.7668, lng: -44.0917 }, // Ribeirão das Neves - MG
  { id: "rod", nome: "ROD", codigo: "ROD", lat: -11.4311, lng: -61.4562 }, // Ji-Paraná - RO
  { id: "rvd", nome: "RVD", codigo: "RVD", lat: -16.6538, lng: -49.2527 }, // Goiânia - GO
  { id: "sor", nome: "SOR", codigo: "SOR", lat: -23.5015, lng: -47.4526 }, // Sorocaba - SP
  { id: "upm", nome: "UPM", codigo: "UPM", lat: -30.0346, lng: -51.2177 }, // Porto Alegre - RS
  { id: "ura_i", nome: "URA I", codigo: "URA I", lat: -10.2128, lng: -48.3603 }, // Palmas - TO
  {
    id: "ura_ii",
    nome: "URA II",
    codigo: "URA II",
    lat: -10.2184,
    lng: -48.3284,
  }, // Palmas - TO
];

export const locaisEspecificos: LocalEspecifico[] = [
  { id: "acido_sulfurico_i", nome: "Ácido sulfúrico I" },
  { id: "acido_sulfurico_ii", nome: "Ácido sulfúrico II" },
  { id: "acido_sulfurico_iii", nome: "Ácido sulfúrico III" },
  { id: "acido_sulfurico_iv", nome: "Ácido sulfúrico IV" },
  { id: "acido_fosforico", nome: "Ácido fosfórico" },
  { id: "superfosfato_triplo_i", nome: "Superfosfato triplo I" },
  { id: "superfosfato_triplo_ii", nome: "Superfosfato triplo II" },
  { id: "fosfato_monoamonico_1", nome: "Fosfato monoamônico 1" },
  { id: "fosfato_monoamonico_ii", nome: "Fosfato monoamônico II" },
  { id: "unidade_ii_uberaba", nome: "Unidade II Uberaba" },
  { id: "superfosfato_triplo_iii", nome: "Superfosfato triplo III" },
  { id: "ssp", nome: "SSP" },
  { id: "fosfato_bicalcico", nome: "Fosfato bicálcico" },
  {
    id: "tancagem_carregamento_acido_sulfurico",
    nome: "Tancagem e carregamento de ácido sulfúrico",
  },
  {
    id: "estocagem_descarregamento_amonia",
    nome: "Estocagem e descarregamento de amônia",
  },
  {
    id: "tancagem_armazenamento_oleo_combustivel",
    nome: "Tancagem e armazenamento de óleo combustível",
  },
  {
    id: "recebimento_estocagem_enxofre_ceu_aberto",
    nome: "Recebimento e estocagem de enxofre a céu aberto",
  },
  {
    id: "armazem_estocagem_fertilizantes",
    nome: "Armazém para estocagem e armazenamento de fertilizantes",
  },
  {
    id: "unidade_recebimento_rocha_polpa",
    nome: "Unidade de recebimento de rocha polpa",
  },
  {
    id: "unidade_filtragem_secagem_rocha",
    nome: "Unidade de filtragem e secagem de rocha",
  },
  { id: "unidade_expedicao_rocha", nome: "Unidade de expedição de rocha" },
  {
    id: "unidade_transferencia_rocha_polpa",
    nome: "Unidade de tranferência de rocha polpa",
  },
  {
    id: "central_utilidades_agua_vapor",
    nome: "Central de utilidades água vapor",
  },
  { id: "torres_resfriamento", nome: "Torres de resfriamento" },
  { id: "captacao_agua", nome: "Captação dágua" },
  { id: "fusao_enxofre", nome: "Fusão de enxofre" },
  {
    id: "lagoa_recirculacao_aguas_acidas",
    nome: "Lagoa de recirculação de águas ácidas",
  },
  { id: "lagoas_estocagem_gesso", nome: "Lagoas de estocagem de gesso" },
  {
    id: "tratamento_efluentes_lagoas_decantacao",
    nome: "Tratamento de efluentes e lagoas de decantação",
  },
  {
    id: "estacao_bombeamento_efluentes",
    nome: "Estação de bombeamento de efluentes",
  },
  { id: "patio_ferroviario", nome: "Pátio ferroviário" },
  { id: "diretoria", nome: "Diretoria" },
  { id: "projetos", nome: "Projetos" },
  {
    id: "logistica_juridico_comercial",
    nome: "Logística Jurídico e comercial",
  },
  { id: "gestao_contratos", nome: "Gestão de contratos" },
  {
    id: "informatica_deposito_infra_devemada",
    nome: "Informática e depósito infra DEVEMADA",
  },
  {
    id: "administracao_producao_laboratorio",
    nome: "Administração de produção e laboratório",
  },
  { id: "gerencia_industrial_pcp", nome: "Gerência industrial PCP" },
  {
    id: "engenharia_manutencao_arquivo_tecnico",
    nome: "Engenharia de manutenção arquivo técnico",
  },
  { id: "meio_ambiente_qualidade", nome: "Meio ambiente qualidade" },
  {
    id: "oficina_manutencao_mecanica_planejamento",
    nome: "Oficina de manutenção mecânica e planejamento",
  },
  {
    id: "oficina_manutencao_mecanica_ferramentaria",
    nome: "Oficina de manutenção mecânica e ferramentaria",
  },
  { id: "predio_manutencao_geral", nome: "Prédio de manutenção geral" },
  {
    id: "manutencao_eletrica_tubulacao",
    nome: "Manutenção elétrica tubulação",
  },
  {
    id: "manutencao_eletrica_instrumentacao",
    nome: "Manutenção elétrica instrumentação",
  },
  { id: "jateamento_areia_pintura", nome: "Jateamento de areia e pintura" },
  { id: "almoxarifado_predio_b", nome: "Almoxarifado prédio B" },
  { id: "almoxarifado_predio_a", nome: "Almoxarifado prédio A" },
  { id: "armazem_produtos_quimicos", nome: "Armazém de produtos químicos" },
  {
    id: "armazem_produtos_inflamaveis",
    nome: "Armazém de produtos inflamáveis",
  },
  {
    id: "manutencao_pequenos_reparos_portaria_armazem_externa",
    nome: "Manutenção de pequenos reparos portaria armazém externa",
  },
  { id: "sala_treinamento", nome: "Sala de treinamento" },
  {
    id: "cantinho_qualifertil_entretenimento",
    nome: "Cantinho qualifértil entretenimento",
  },
  { id: "pab_banco", nome: "PAB Banco" },
  { id: "almoxarifado_semasq", nome: "Almoxarifado SEMASQ" },
  { id: "semasq", nome: "SEMASQ" },
  { id: "vestiario_central", nome: "Vestiário central" },
  { id: "ambulatorio_copa", nome: "Ambulatório e copa" },
  { id: "infra_malote", nome: "Infra e malote" },
  { id: "rh_comunicacao_adm_pessoal", nome: "RH Comunicação Adm de pessoal" },
  { id: "cozinha_refeitorio", nome: "Cozinha e refeitório" },
  {
    id: "balanca_rodoviaria_expedicao_recebimento",
    nome: "Balança rodoviária expedição e recebimento",
  },
  { id: "casa_amostragem", nome: "Casa de amostragem" },
  { id: "portaria_principal", nome: "Portaria principal" },
  { id: "portaria_industrial", nome: "Portaria industrial" },
  { id: "portaria_caminhoes", nome: "Portaria de caminhões" },
  {
    id: "portaria_caminhoes_restaurante_sala_motoristas",
    nome: "Portaria de caminhões Restaurante sala de motoristas",
  },
  { id: "estacionamento_caminhoes", nome: "Estacionamento de caminhões" },
  { id: "portaria_expansao", nome: "Portaria da expansão" },
  { id: "portaria_ferroviaria", nome: "Portaria ferroviária" },
  { id: "portaria_gesso", nome: "Portaria do gesso" },
  { id: "cmd", nome: "CMD" },
  { id: "lsi_logistica", nome: "LSI Logística" },
  { id: "lsi_torre", nome: "LSI Torre" },
  { id: "mgm", nome: "MGM" },
  { id: "lagoa_sep_2a", nome: "Lagoa SEP 2A" },
  { id: "deposito_rlt", nome: "Depósito RLT" },
  { id: "canteiro_consorcio", nome: "Canteiro Consórcio" },
  { id: "lagoa_peixes", nome: "Lagoa de peixes" },
  { id: "estacionamento_diretoria", nome: "Estacionamento Diretoria" },
  {
    id: "estacionamento_gerencia_industrial",
    nome: "Estacionamento Gerência Industrial",
  },
  {
    id: "estacionamento_visitantes_portaria_principal",
    nome: "Estacionamento Visitantes Portaria Principal",
  },
  {
    id: "estacionamento_expansao_canteiro",
    nome: "Estacionamento expansão canteiro",
  },
  {
    id: "estacionamento_expansao_externo",
    nome: "Estacionamento expansão externo",
  },
  {
    id: "estacionamento_industrial_externo",
    nome: "Estacionamento industrial externo",
  },
  { id: "estacionamento_ciu_ii", nome: "Estacionamento CIU II" },
  { id: "guara", nome: "Guará" },
  {
    id: "subestacao_energia_alta_tensao",
    nome: "Substação de Energia Alta Tensão",
  },
];

export const ocorrencias: Ocorrencia[] = [
  {
    id: "001",
    titulo: "Vazamento de produto químico",
    descricao: "Vazamento detectado no tanque da unidade ARA",
    status: "critical",
    unidadeId: "ara",
    lat: -21.7946,
    lng: -48.1756,
    data: "2024-08-01T14:30:00",
  },
  {
    id: "002",
    titulo: "Falha no sistema de segurança",
    descricao: "Câmeras inativas na unidade CIU",
    status: "warning",
    unidadeId: "ciu",
    lat: -22.9068,
    lng: -43.1729,
    data: "2024-08-02T09:15:00",
  },
  {
    id: "003",
    titulo: "Acesso não autorizado",
    descricao: "Pessoa desconhecida na portaria",
    status: "active",
    unidadeId: "cmp",
    lat: -22.1216,
    lng: -51.3883,
    data: "2024-08-03T22:45:00",
  },
  {
    id: "004",
    titulo: "Curto-circuito no painel elétrico",
    descricao: "Ocorrência crítica registrada na unidade PRÁ I em Salvador.",
    status: "critical",
    unidadeId: "pra_i",
    lat: -12.9718,
    lng: -38.5011,
    data: "2024-08-06T11:00:00",
  },
  {
    id: "005",
    titulo: "Falha no sistema de alarme",
    descricao:
      "O sistema de alarme não disparou durante simulação de emergência.",
    status: "warning",
    unidadeId: "fpr",
    lat: -25.4284,
    lng: -49.2733,
    data: "2024-08-06T14:45:00",
  },
];

// Funções utilitárias para buscar dados
export const getUnidadeById = (id: string): Unidade | undefined => {
  return unidades.find((unidade) => unidade.id === id);
};

export const getUnidadeByCodigo = (codigo: string): Unidade | undefined => {
  return unidades.find((unidade) => unidade.codigo === codigo);
};

export const getLocalById = (id: string): LocalEspecifico | undefined => {
  return locaisEspecificos.find((local) => local.id === id);
};

export const getLocalByNome = (nome: string): LocalEspecifico | undefined => {
  return locaisEspecificos.find((local) => local.nome === nome);
};

// Função para obter todos os dados
export const getAllData = () => {
  return {
    unidades,
    locaisEspecificos,
  };
};
