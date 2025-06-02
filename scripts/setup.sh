#!/bin/bash

echo "🚀 Brain Agriculture - Setup Inicial"
echo "======================================"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado! Configure as variáveis conforme necessário."
else
    echo "✅ Arquivo .env já existe."
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

echo ""
echo "🐳 Iniciando containers..."
docker-compose up -d postgres

echo ""
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🗄️  Configurando banco de dados..."
npx prisma generate
npx prisma migrate dev --name init

echo ""
echo "🌱 Executando seed..."
npm run prisma:seed

echo ""
echo "✅ Setup concluído!"
echo ""
echo "🚀 Para iniciar a aplicação em desenvolvimento:"
echo "   npm run start:dev"
echo ""
echo "📚 Documentação estará disponível em:"
echo "   http://localhost:3000/api/v1/docs"
echo ""
echo "🗄️  Para acessar o Prisma Studio:"
echo "   npm run prisma:studio" 