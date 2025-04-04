// Importa os módulos necessários do Electron: 'app' (para o ciclo de vida) e 'BrowserWindow' (para criar janelas)
const { app, BrowserWindow } = require('electron');
// Importa o módulo 'path' para manipulação de caminhos de arquivo
const path = require('path');
// Importa a função 'startServer' definida em 'server.js' para iniciar o servidor Express
const { startServer } = require(path.join(__dirname, 'server.js'));

// Inicia o servidor Express para processamento de uploads e outras rotas
startServer();

// Variável que armazenará a referência à janela principal da aplicação
let mainWindow;

// Quando o Electron estiver pronto, cria a janela principal
app.on('ready', () => {
  // Cria uma nova janela definindo as dimensões e configurações web
  mainWindow = new BrowserWindow({
    width: 1280, // Largura da janela
    height: 720, // Altura da janela
    webPreferences: {
      // Permite integração com Node.js na camada de renderização
      nodeIntegration: true,
      // Desativa a isolação de contexto (atenção: isto não é recomendado para produção sem cuidados adicionais)
      contextIsolation: false,
    },
  });

  // Carrega o arquivo HTML local que contém a interface de captura da webcam
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
});