const express = require ('express');
const router = express.Router();

//middlewares
const uploadsL = require ('../middlewares/upImgLivros');
// const uploadsA = require ('../middlewares/upImgAutores');
// const uploadsG = require ('../middlewares/upImgGeneros');
// const uploadsE = require ('../middlewares/upImgEditoras');
// const uploadsU = require ('../middlewares/upImgUsuarios');

const livrosController = require ('../controllers/Livros');
const cursosController = require ('../controllers/Cursos');
const generosController = require ('../controllers/Generos');
const autoresController = require ('../controllers/Autores');
const usuariosController = require ('../controllers/Usuarios');
const editorasController = require ('../controllers/Editoras');
const reservasController = require ('../controllers/Reservas');
const contatosController = require ('../controllers/Contatos');
const exemplaresController = require ('../controllers/Exemplares');
const emprestimosController = require ('../controllers/Emprestimos');
const recomendacaoController = require ('../controllers/Recomendacao');
const livros_autoresController = require ('../controllers/Livros_autores');
const livros_generosController = require ('../controllers/Livros_generos');
const usuarios_cursosController = require ('../controllers/Usuario_Cursos');

//LISTAR sem pesquisa
router.get ('/autores', (autoresController.listarAutores));
router.get ('/generos', (generosController.listarGeneros));
router.get ('/editoras', (editorasController.listarEditoras));
router.get ('/exemplares', (exemplaresController.listarExemplares));
router.get ('/usuarios_cursos', (usuarios_cursosController.listarUsuarios_Cursos));

//LISTAR com pesquisa
router.post ('/cursos', (cursosController.listarCursos));
router.post ('/livros', (livrosController.listarLivros));
router.post ('/usuarios', (usuariosController.listarUsuarios));
router.post ('/contatos', (contatosController.listarContatos));
router.post ('/reservas', (reservasController.listarReservas));
router.post ('/liv_gerenciar', (livrosController.gerenciarLivros))
router.post ('/emprestimos', (emprestimosController.listarEmprestimos));
router.post ('/rec_listar', (recomendacaoController.listarRecomendacao));
router.post ('/dispUsucursos', (usuarios_cursosController.dispUsucursos));
router.post ('/dispAutores', (livros_autoresController.dispAutores));
router.post ('/dispGeneros', (livros_generosController.dispGeneros));
router.post ('/livros_autores', (livros_autoresController.listarLivros_Autores));
router.post ('/livros_generos', (livros_generosController.listarLivros_Generos));
router.post ('/consulta_exemplares', (exemplaresController.verificarExemplaresReserva));

//CADASTRAR com imagem
router.post ('/liv_cadastrar', uploadsL.single('img'), livrosController.cadastrarLivros);

//CADASTRAR sem imagem
router.post ('/cursos', (cursosController.cadastrarCursos));
router.post ('/generos',(generosController.cadastrarGeneros));
router.post ('/autores', (autoresController.cadastrarAutores));
router.post ('/usu_login', (usuariosController.loginUsuarios));
router.post ('/editoras', (editorasController.cadastrarEditoras));
router.post ('/envio_email', (usuariosController.envioEmailRedSenha));
router.post ('/usu_cadastrar', (usuariosController.cadastrarUsuarios));
router.post ('/exemplares', (exemplaresController.cadastrarExemplares));
router.post ('/usu_pendentes', (usuariosController.listarUsuariosPendentes));
router.post ('/usu_reprovados', (usuariosController.listarUsuariosReprovados));
router.post ('/emp_cadastrar', (emprestimosController.cadastrarEmprestimos));
router.post ('/recomendacao', (recomendacaoController.cadastrarRecomendacao));
router.post ('/livros_autores', (livros_autoresController.cadastrarLivros_Autores));
router.post ('/livros_generos', (livros_generosController.cadastrarLivros_Generos));
router.post ('/usuarios_cursos', (usuarios_cursosController.cadastrarUsuarios_Cursos));

//UPDATE normal
router.patch ('/livros/:liv_cod', (livrosController.editarLivros));
router.patch ('/cursos/:cur_cod', (cursosController.editarCursos));
router.patch ('/autores/:aut_cod', (autoresController.editarAutores));
router.patch ('/generos/:gen_cod', (generosController.editarGeneros));
router.patch ('/usuarios/:usu_cod', (usuariosController.editarPerfil));
router.patch ('/editoras/:edt_cod', (editorasController.editarEditoras));
router.patch ('/cont_editar/:cont_cod', (contatosController.editarContatos));
router.patch ('/exemplares/:exe_cod', (exemplaresController.editarExemplares));
router.patch ('/emprestimos/:emp_cod', (emprestimosController.editarEmprestimos));
router.patch ('/recomendacao/:rcm_cod', (recomendacaoController.editarRecomendacao));
router.patch ('/livros_autores/:lau_cod', (livros_autoresController.editarLivros_Autores));
router.patch ('/livros_generos/:lge_cod', (livros_generosController.editarLivros_Generos));
router.patch ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.editarUsuarios_Cursos));

//UPDATE Personalizado
router.patch ('/liv_inativar', (livrosController.inativarLivros));
router.patch ('/analizarUcu', (usuariosController.analizarUsuariosCursos)); 
router.patch ('/emp_renovar/:emp_cod', (emprestimosController.renovarEmprestimos));
router.patch ('/usu_reprovar/:usu_cod', (usuariosController.analisarUsuariosReprovados));
router.patch('/emp_confirmar/:emp_cod', emprestimosController.confirmarRetirada);
// router.patch ('red_senha', (usuariosController.redSenha));

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
