import server from './services/server';

const PORT = 8080

server.listen(PORT, () => console.log(`Servidor ON en puerto ${PORT}`))