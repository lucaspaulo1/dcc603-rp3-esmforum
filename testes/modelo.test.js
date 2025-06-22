const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

// Teste para get_pergunta()
test('Testando recuperação de pergunta por ID', () => {
  const id = modelo.cadastrar_pergunta('Qual é o sentido da vida?');
  const pergunta = modelo.get_pergunta(id);
  expect(pergunta.texto).toBe('Qual é o sentido da vida?');
  expect(pergunta.id_usuario).toBe(1);
});

// Teste para cadastrar_resposta() e get_respostas()
test('Testando cadastro e recuperação de respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Quanto é 2+2?');
  
  // Cadastrar resposta e verificar retorno
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, '4');
  expect(typeof id_resposta).toBe('number');
  
  // Verificar respostas
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('4');
  expect(respostas[0].id_pergunta).toBe(id_pergunta);
});

// Teste para get_num_respostas()
test('Testando contagem de respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta com respostas');
  
  // Verificar contagem inicial
  expect(modelo.get_num_respostas(id_pergunta)).toBe(0);
  
  // Adicionar respostas e verificar contagem
  modelo.cadastrar_resposta(id_pergunta, 'Resposta 1');
  modelo.cadastrar_resposta(id_pergunta, 'Resposta 2');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(2);
});

// Teste para verificação completa de respostas
test('Testando integração perguntas-respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual é a capital da França?');
  
  // Adicionar múltiplas respostas
  modelo.cadastrar_resposta(id_pergunta, 'Paris');
  modelo.cadastrar_resposta(id_pergunta, 'Lyon');
  modelo.cadastrar_resposta(id_pergunta, 'Marselha');
  
  // Verificar via listar_perguntas()
  const pergunta = modelo.listar_perguntas().find(p => p.id_pergunta === id_pergunta);
  expect(pergunta.num_respostas).toBe(3);
  
  // Verificar via get_respostas()
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(3);
  
  // Verificar textos das respostas
  const textos = respostas.map(r => r.texto);
  expect(textos).toContain('Paris');
  expect(textos).toContain('Lyon');
  expect(textos).toContain('Marselha');
});
