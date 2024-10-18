const express = require ('express');
const router = express.Router();

const uploadsA = require ('../middlewares/upImgAutores');
const uploadsG = require ('../middlewares/upImgGeneros');
const uploadsE = require ('../middlewares/upImgEditoras');
const uploadsU = require ('../middlewares/upImgUsuarios');
const uploadsL = require ('../middlewares/upImgLivros');

const usuariosController = require ('../controllers/Usuarios');
const livrosController = require ('../controllers/Livros');
const autoresController = require ('../controllers/Autores');
const editorasController = require ('../controllers/Editoras');
const cursosController = require ('../controllers/Cursos');
const generosController = require ('../controllers/Generos');
const exemplaresController = require ('../controllers/Exemplares');
const emprestimosController = require ('../controllers/Emprestimos');
const recomendacaoController = require ('../controllers/Recomendacao');
const usuarios_cursosController = require ('../controllers/Usuario_Cursos');
const livros_autoresController = require ('../controllers/Livros_autores');
const livros_generosController = require ('../controllers/Livros_generos');
const reservasController = require ('../controllers/Reservas');
const contatosController = require ('../controllers/Contatos');
const senhaController = require('../controllers/Senha');

//LISTAR sem pesquisa
router.get ('/autores', (autoresController.listarAutores));
router.get ('/generos', (generosController.listarGeneros));
router.get ('/editoras', (editorasController.listarEditoras));
router.get ('/exemplares', (exemplaresController.listarExemplares));
router.get ('/livros_autores', (livros_autoresController.listarLivros_Autores));
router.get ('/livros_generos', (livros_generosController.listarLivros_Generos));
router.get ('/usuarios_cursos', (usuarios_cursosController.listarUsuarios_Cursos));

//LISTAR com pesquisa
router.post ('/usuarios', (usuariosController.listarUsuarios));
router.post ('/cursos', (cursosController.listarCursos));
router.post ('/livros', (livrosController.listarLivros));
router.post ('/contatos', (contatosController.listarContatos));
router.post ('/reservas', (reservasController.listarReservas));
router.post ('/liv_gerenciar', (livrosController.gerenciarLivros))
router.post ('/emprestimos', (emprestimosController.listarEmprestimos));
router.post ('/rec_listar', (recomendacaoController.listarRecomendacao));

//CADASTRAR com imagem
router.post ('/cursos', (cursosController.cadastrarCursos));
router.post ('/usuarios', usuariosController.cadastrarUsuarios);
router.post ('/generos', uploadsG.single('img'), generosController.cadastrarGeneros);
router.post ('/autores', uploadsA.single('img'), autoresController.cadastrarAutores);
router.post ('/editoras', uploadsE.single('img'), editorasController.cadastrarEditoras);
router.post ('/liv_cadastrar', uploadsL.single('img'), livrosController.cadastrarLivros);

//CADASTRAR sem imagem
router.post ('/usu_login', (usuariosController.loginUsuarios));
router.post ('/usu_pendentes', (usuariosController.listarUsuariosPendentes));
router.post ('/exemplares', (exemplaresController.cadastrarExemplares));
router.post ('/emp_cadastrar', (emprestimosController.cadastrarEmprestimos));
router.post ('/recomendacao', (recomendacaoController.cadastrarRecomendacao));
router.post ('/livros_autores', (livros_autoresController.cadastrarLivros_Autores));
router.post ('/livros_generos', (livros_generosController.cadastrarLivros_Generos));
router.post ('/usuarios_cursos', (usuarios_cursosController.cadastrarUsuarios_Cursos));
router.post('/esquecer_senha', (senhaController.esquecerSenha));
router.post('/recuperar_senha', (senhaController.redefinirSenha));

//UPDATE normal
router.patch ('/livros/:liv_cod', (livrosController.editarLivros));
router.patch ('/cont_editar/:cont_cod', (contatosController.editarContatos));
router.patch ('/cursos/:cur_cod', (cursosController.editarCursos));
router.patch ('/autores/:aut_cod', (autoresController.editarAutores));
router.patch ('/generos/:gen_cod', (generosController.editarGeneros));
router.patch ('/usuarios/:usu_cod', (usuariosController.editarPerfil));
router.patch ('/editoras/:edt_cod', (editorasController.editarEditoras));
router.patch ('/exemplares/:exe_cod', (exemplaresController.editarExemplares));
router.patch ('/emprestimos/:emp_cod', (emprestimosController.editarEmprestimos));
router.patch ('/recomendacao/:rcm_cod', (recomendacaoController.editarRecomendacao));
router.patch ('/livros_autores/:lau_cod', (livros_autoresController.editarLivros_Autores));
router.patch ('/livros_generos/:lge_cod', (livros_generosController.editarLivros_Generos));
router.patch ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.editarUsuarios_Cursos));

//UPDATE Personalizado
router.patch ('/usu_ocultar', (usuariosController.ocultarUsuarios));
router.patch ('/emp_renovar/:emp_cod', (emprestimosController.renovarEmprestimos));
router.patch ('/analizarUcu', (usuariosController.analizarUsuariosCursos)); 
router.patch ('/liv_inativar', (livrosController.inativarLivros));

//DELETE ou EXCLUIR
router.delete ('/livros/:liv_cod', (livrosController.apagarLivros));
router.delete ('/cursos/:cur_cod', (cursosController.apagarCursos));
router.delete ('/generos/:gen_cod', (generosController.apagarGeneros));
router.delete ('/autores/:aut_cod', (autoresController.apagarAutores));
router.delete ('/editoras/:edt_cod', (editorasController.apagarEditoras));
router.delete ('/exemplares/:exe_cod', (exemplaresController.apagarExemplares));
router.delete ('/emprestimos/:emp_cod', (emprestimosController.apagarEmprestimos));
router.delete ('/recomendacao/:rcm_cod', (recomendacaoController.apagarRecomendacao));
router.delete ('/livros_autores/:lau_cod', (livros_autoresController.apagarLivros_Autores));
router.delete ('/livros_generos/:lge_cod', (livros_generosController.apagarLivros_Generos));
router.delete ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.apagarUsuarios_Cursos));

module.exports = router;
