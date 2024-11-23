const express = require ('express');
const router = express.Router();

//middlewares
const uploadsL = require ('../middlewares/upImgLivros');
const uploadsU = require ('../middlewares/upImgUsuarios');
// const uploadsA = require ('../middlewares/upImgAutores');
// const uploadsG = require ('../middlewares/upImgGeneros');
// const uploadsE = require ('../middlewares/upImgEditoras');

const livrosController = require ('../controllers/Livros');
const cursosController = require ('../controllers/Cursos');
const generosController = require ('../controllers/Generos');
const autoresController = require ('../controllers/Autores');
const usuariosController = require ('../controllers/Usuarios');
const editorasController = require ('../controllers/Editoras');
const reservasController = require ('../controllers/Reservas');
const contatosController = require ('../controllers/Contatos');
const exemplaresController = require ('../controllers/Exemplares');
const solicitacaoController = require ('../controllers/Solicitacao');
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
router.post ('/Aut_disp', (livros_autoresController.dispAutores));
router.post ('/liv_gerenciar', (livrosController.gerenciarLivros));
router.post ('/emprestimos', (emprestimosController.listarEmprestimos));
router.post ('/rec_listar', (recomendacaoController.listarRecomendacao));
router.post ('/Usuc_disp', (usuarios_cursosController.dispUsucursos));
router.post ('/usu_aprovados', (solicitacaoController.listarUsuariosAprovados));
router.post ('/livros_aut', (livros_autoresController.listarLivros_Autores));
router.post ('/consulta_exemplares', (exemplaresController.verificarExemplaresReserva));

//CADASTRAR e atualização de imagem
router.post ('/liv_cadastrar', (livrosController.cadastrarLivros));
router.post ('/usu_cadastrar', (usuariosController.cadastrarUsuarios));
router.post ('/upload_livro', uploadsL.single('img'), livrosController.cadastrarImagemLivro);
// router.post ('/upload_usuario', uploadsU.single('img'), usuariosController.cadastrarImagemUsuario);

// Livros Generos
router.post ('/gen_Disp/:liv_cod', (livros_generosController.dispGeneros));
router.post ('/liv_generos/:liv_cod', (livros_generosController.listarLivrosGeneros));
router.patch ('/livros_gen/:liv_cod/:gen_cod', (livros_generosController.adicionarLivrosGeneros));
router.delete ('/livros_generos/:liv_cod/:gen_cod', (livros_generosController.removerLivrosGeneros));

//CADASTRAR sem imagem
router.post ('/cursos', (cursosController.cadastrarCursos));
router.post ('/generos',(generosController.cadastrarGeneros));
router.post ('/autores', (autoresController.cadastrarAutores));
router.post ('/usu_login', (usuariosController.loginUsuarios));
router.post ('/editoras', (editorasController.cadastrarEditoras));
router.post ('/envio_email', (usuariosController.envioEmailRedSenha));
router.post ('/exemplares', (exemplaresController.cadastrarExemplares));
router.post ('/emp_cadastrar', (emprestimosController.cadastrarEmprestimos));
router.post ('/recomendacao', (recomendacaoController.cadastrarRecomendacao));
router.post ('/usu_pendentes', (solicitacaoController.listarUsuariosPendentes));
router.post ('/usu_reprovados', (solicitacaoController.listarUsuariosReprovados));
router.post ('/livros_autores', (livros_autoresController.cadastrarLivros_Autores));
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
router.patch ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.editarUsuarios_Cursos));

//UPDATE Personalizado
router.post ('/liv_inativar/:liv_cod', (livrosController.inativarLivros));
router.post ('/liv_ativar/:liv_cod', (livrosController.ativarLivros));
router.patch ('/res_cancelar/:emp_cod', (reservasController.cancelarReservas));
router.patch ('/devolver/:emp_cod', (emprestimosController.devolverEmprestimos));
router.patch ('/emp_renovar/:emp_cod', (emprestimosController.renovarEmprestimos));
router.patch ('/emp_confirmar/:emp_cod', (emprestimosController.confirmarEmprestimos));
router.patch ('/usuc_aprovar', (solicitacaoController.analisarUsuariosCursos));
router.patch ('/usu_reprovar/:usu_cod', (solicitacaoController.analisarUsuariosReprovados));
// router.patch ('/emp_confirmar/:emp_cod', (emprestimosController.confirmarRetirada));
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
router.delete ('/usuarios_cursos/:ucu_cod', (usuarios_cursosController.apagarUsuarios_Cursos));
router.delete ('/livros_autores/:lau_cod:/:liv_cod', (livros_autoresController.apagarLivros_Autores));

module.exports = router;
