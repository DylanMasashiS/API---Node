const express = require ('express');
const router = express.Router();

const usuariosController = require ('../controllers/Usuarios');
const livrosController = require ('../controllers/Livros');
const autoresController = require ('../controllers/Autores');
const editorasController = require ('../controllers/Editoras');
const cursosController = require ('../controllers/Cursos');
const exemplaresController = require ('../controllers/Exemplares');
const emprestimosController = require ('../controllers/Emprestimos');
const recomendacaoController = require ('../controllers/Recomendacao');
const usuarios_cursosController = require ('../controllers/Usuario_Curso');
const livros_autoresController = require ('../controllers/Livros_autores');
const livros_generosController = require ('../controllers/Livros_generos');

router.get ('/usuarios/:usu_nome', (usuariosController.listarUsuarios));
router.get ('/login_usuarios/:usu_email,:usu_senha', (usuariosController.loginUsuarios));
router.get ('/livros/:liv_nome', (livrosController.listarLivros));
router.get ('/autores/:aut_nome', (autoresController.listarAutores));
router.get ('/editoras/:edt_nome', (editorasController.listarEditoras));
router.get ('/cursos/:cur_nome', (cursosController.listarCursos));
router.get ('/exemplares/:liv_nome', (exemplaresController.listarExemplares));
router.get ('/emprestimos/:usu_nome', (emprestimosController.listarEmprestimos));
router.get ('/recomendacao/: usu_nome', (recomendacaoController.listarRecomendacao));
router.get ('/usuarios_cursos', (usuarios_cursosController.listarUsuarios_Cursos));
router.get ('/livros_autores', (livros_autoresController.listarLivros_Autores));
router.get ('/livros_generos', (livros_generosController.listarLivros_Generos));

router.post ('/usuarios', (usuariosController.cadastrarUsuarios));
router.post ('/livros', (livrosController.cadastrarLivros));
router.post ('/autores', (autoresController.cadastrarAutores));
router.post ('/editoras', (editorasController.cadastrarEditoras));
router.post ('/cursos', (cursosController.cadastrarCursos));
router.post ('/exemplares', (exemplaresController.cadastrarExemplares));
router.post ('/emprestimos', (emprestimosController.cadastrarEmprestimos));
router.post ('/recomendacao', (recomendacaoController.cadastrarRecomendacao));
router.post ('/usuarios_cursos', (usuarios_cursosController.cadastrarUsuarios_Cursos));
router.post ('/livros_autores', (livros_autoresController.cadastrarLivros_Autores));
router.post ('/livros_generos', (livros_generosController.cadastrarLivros_Generos));    

router.put ('/usuarios', (usuariosController.editarUsuarios));
router.put ('/ocultar_usuarios/:usu_cod', (usuariosController.ocultarUsuarios));
router.put ('/livros', (livrosController.editarLivros));
router.put ('/autores', (autoresController.editarAutores));
router.put ('/editoras', (editorasController.editarEditoras));
router.put ('/cursos', (cursosController.editarCursos));
router.put ('/exemplares', (exemplaresController.editarExemplares));
router.put ('/emprestimos/:emp_cod', (emprestimosController.editarEmprestimos));
router.put ('/recomendacao', (recomendacaoController.editarRecomendacao));
router.put ('/usuarios_cursos', (usuarios_cursosController.editarUsuarios_Cursos));
router.put ('/livros_autores', (livros_autoresController.editarLivros_Autores));
router.put ('/livros_generos', (livros_generosController.editarLivros_Generos));

router.delete ('/usuarios', (usuariosController.apagarUsuarios));
router.delete ('/livros', (livrosController.apagarLivros));
router.delete ('/autores', (autoresController.apagarAutores));
router.delete ('/editoras', (editorasController.apagarEditoras));
router.delete ('/cursos', (cursosController.apagarCursos));
router.delete ('/exemplares', (exemplaresController.apagarExemplares));
router.delete ('/emprestimos', (emprestimosController.apagarEmprestimos));
router.delete ('/recomendacao', (recomendacaoController.apagarRecomendacao));
router.delete ('/usuarios_cursos', (usuarios_cursosController.apagarUsuarios_Cursos));
router.delete ('/livros_autores', (livros_autoresController.apagarLivros_Autores));
router.delete ('/livros_generos', (livros_generosController.apagarLivros_Generos));

module.exports = router;
