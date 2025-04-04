// Importa módulos essenciais: express para framework HTTP,
// body-parser para interpretar JSON, fs para operações de arquivos e path para manipulação de caminhos.
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Configura o body-parser para interpretar requisições com JSON, aumentando o limite para 10mb
app.use(bodyParser.json({ limit: '10mb' }));

// Configura para servir arquivos estáticos da pasta 'uploads' quando acessados pela rota '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint POST para receber a imagem enviada em Base64
app.post('/upload', (req, res) => {
  // Extrai a propriedade 'image' do corpo da requisição
  const { image } = req.body;

  // Verifica se a imagem foi enviada; caso contrário, retorna erro 400
  if (!image) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  // Remove o cabeçalho do Base64 da string da imagem para obter os dados puros
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  // Gera um caminho para salvar a imagem, utilizando um timestamp para evitar conflitos
  const filePath = path.join(__dirname, 'uploads', `image_${Date.now()}.png`);

  // Garante que a pasta 'uploads' exista; se não existir, ela é criada de forma recursiva
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
  
  // Escreve o arquivo com os dados decodificados do Base64
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      // Em caso de erro na escrita, exibe o erro e retorna status 500
      console.error('Erro ao salvar a imagem:', err);
      return res.status(500).json({ error: 'Erro ao salvar a imagem' });
    }

    // Se a escrita for bem sucedida, exibe o caminho do arquivo salvo e retorna mensagem de sucesso
    console.log('Imagem salva em:', filePath);
    res.json({ message: 'Imagem recebida e salva com sucesso!' });
  });
});

// Endpoint GET para listar as imagens armazenadas em 'uploads'
app.get('/api/uploads', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      // Se ocorrer um erro na leitura da pasta, retorna erro 500
      return res.status(500).json({ error: 'Erro ao ler uploads' });
    }
    // Filtra os arquivos terminados em '.png' e mapeia cada um para sua rota pública relativa
    const images = files.filter(f => f.endsWith('.png')).map(f => `/uploads/${f}`);
    res.json({ images });
  });
});

// Endpoint GET para servir a página 'registros.html'
app.get('/registros', (req, res) => {
  res.sendFile(path.join(__dirname, 'registros.html'));
});

// Função que inicia o servidor Express na porta 4400
function startServer() {
  const PORT = 4400;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// Exporta a função 'startServer' para ser utilizada em 'main.js'
module.exports = { startServer };