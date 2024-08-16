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

//LISTAR 
router.get ('/usuarios', (usuariosController.listarUsuarios));
router.get ('/livros', (livrosController.listarLivros));
router.get ('/autores', (autoresController.listarAutores));
router.get ('/editoras', (editorasController.listarEditoras));
router.get ('/cursos', (cursosController.listarCursos));
router.get ('/generos', (generosController.listarGeneros));
router.get ('/exemplares', (exemplaresController.listarExemplares));
router.get ('/emprestimos', (emprestimosController.listarEmprestimos));
router.get ('/recomendacao', (recomendacaoController.listarRecomendacao));
router.get ('/usuarios_cursos', (usuarios_cursosController.listarUsuarios_Cursos));
router.get ('/livros_autores', (livros_autoresController.listarLivros_Autores));
router.get ('/livros_generos', (livros_generosController.listarLivros_Generos));

//CADASTRAR ou INSERIR
// router.post ('/uploads/CapaAutores', uploads.single ('img'), (autoresController.cadastrarAutores));
router.post ('/usuarios', uploadsU.single('img'), usuariosController.cadastrarUsuarios);
router.post ('/login_usuarios', (usuariosController.loginUsuarios));
router.post ('/livros', uploadsL.single('img'), livrosController.cadastrarLivros);
router.post ('/autores', uploadsA.single('img'), autoresController.cadastrarAutores);
router.post ('/editoras', uploadsE.single('img'), editorasController.cadastrarEditoras);
router.post ('/cursos', (cursosController.cadastrarCursos));
router.post ('/generos', uploadsG.single('img'), generosController.cadastrarGeneros);
router.post ('/exemplares', (exemplaresController.cadastrarExemplares));
router.post ('/emprestimos', (emprestimosController.cadastrarEmprestimos));
router.post ('/recomendacao', (recomendacaoController.cadastrarRecomendacao));
router.post ('/usuarios_cursos', (usuarios_cursosController.cadastrarUsuarios_Cursos));
router.post ('/livros_autores', (livros_autoresController.cadastrarLivros_Autores));
router.post ('/livros_generos', (livros_generosController.cadastrarLivros_Generos));    

//UPDATE ou EDITAR
router.patch ('/usuarios/:usu_cod', (usuariosController.editarUsuarios));
router.patch ('/usuarios_ocultar', (usuariosController.ocultarUsuarios));
router.patch ('/livros/:liv_cod', (livrosController.editarLivros));
router.patch ('/autores/:aut_cod', (autoresController.editarAutores));
router.patch ('/editoras/:edt_cod', (editorasController.editarEditoras));
router.patch ('/cursos/:cur_cod', (cursosController.editarCursos));
router.patch ('/generos/:gen_cod', (generosController.editarGeneros));
router.patch ('/exemplares/:exe_cod', (exemplaresController.editarExemplares));
router.patch ('/emprestimos/:emp_cod', (emprestimosController.editarEmprestimos));
router.patch ('/emp_renovar/:emp_cod', (emprestimosController.renovarEmprestimos));
router.patch ('/recomendacao/:rcm_cod', (recomendacaoController.editarRecomendacao));
router.patch ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.editarUsuarios_Cursos));
router.patch ('/livros_autores/:lau_cod', (livros_autoresController.editarLivros_Autores));
router.patch ('/livros_generos/:lge_cod', (livros_generosController.editarLivros_Generos));

//DELETE ou EXCLUIR
router.delete ('/usuarios', (usuariosController.apagarUsuarios));
router.delete ('/livros/:liv_cod', (livrosController.apagarLivros));
router.delete ('/autores/:aut_cod', (autoresController.apagarAutores));
router.delete ('/editoras/:edt_cod', (editorasController.apagarEditoras));
router.delete ('/cursos/:cur_cod', (cursosController.apagarCursos));
router.delete ('/generos/:gen_cod', (generosController.apagarGeneros));
router.delete ('/exemplares/:exe_cod', (exemplaresController.apagarExemplares));
router.delete ('/emprestimos/:emp_cod', (emprestimosController.apagarEmprestimos));
router.delete ('/recomendacao/:rcm_cod', (recomendacaoController.apagarRecomendacao));
router.delete ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.apagarUsuarios_Cursos));
router.delete ('/livros_autores/:lau_cod', (livros_autoresController.apagarLivros_Autores));
router.delete ('/livros_generos/:lge_cod', (livros_generosController.apagarLivros_Generos));

module.exports = router;
