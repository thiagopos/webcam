const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware para processar JSON
app.use(bodyParser.json({ limit: '10mb' }));

// Endpoint para receber a imagem
app.post('/upload', (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  // Decodificar a imagem Base64 e salvar como arquivo
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const filePath = path.join(__dirname, 'uploads', `image_${Date.now()}.png`);

  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
      return res.status(500).json({ error: 'Erro ao salvar a imagem' });
    }

    console.log('Imagem salva em:', filePath);
    res.json({ message: 'Imagem recebida e salva com sucesso!' });
  });
});

function startServer() {
  const PORT = 4400;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = { startServer };