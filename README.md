# Smart Agriculture  - Sistema de Gestão Rural

Sistema backend completo desenvolvido em NestJS para gestão de produtores rurais, fazendas e culturas.

## ⚡ Início Rápido

```bash
# 1. Clone o projeto
git clone <repository-url>
cd brain-agriculture-nestjs

# 2. Execute o setup automático
chmod +x scripts/setup.sh && ./scripts/setup.sh

# 3. Inicie a aplicação
npm run start:dev

# 4. Acesse a documentação
# http://localhost:3000/api/v1/docs
```

🎉 **Pronto!** Sua aplicação estará rodando com banco configurado e dados de exemplo.

## 🚀 Tecnologias

- **Framework**: NestJS
- **ORM**: Prisma
- **Banco de dados**: PostgreSQL
- **Containerização**: Docker + Docker Compose
- **Documentação**: OpenAPI/Swagger
- **Validação**: class-validator + class-transformer
- **Testes**: Jest

## 📋 Funcionalidades

### Entidades Principais
- **Produtores**: Gestão de produtores rurais com validação de CPF/CNPJ
- **Fazendas**: Gestão de propriedades rurais com validação de áreas
- **Culturas**: Gestão de tipos de culturas (Soja, Milho, Café, etc.)
- **Safras**: Gestão de safras por ano
- **Culturas por Fazenda**: Relacionamento entre fazendas e culturas por safra

### Dashboard e Relatórios
- Total de fazendas e hectares
- Gráfico de fazendas por estado
- Gráfico de fazendas por cultura
- Gráfico de uso do solo (área agricultável vs vegetação)

### Sistema
- Health check da aplicação e banco de dados
- Status geral com informações úteis

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd brain-agriculture-nestjs
```

### 🌟 2. Setup Automático (Recomendado)

**A maneira mais fácil e rápida de configurar e executar a aplicação:**

```bash
# Torna o script executável
chmod +x scripts/setup.sh

# Executa o setup completo
./scripts/setup.sh

# Inicia a aplicação
npm run start:dev
```

O script `setup.sh` faz automaticamente:
- ✅ Cria o arquivo `.env` baseado no template
- ✅ Verifica se o Docker está rodando
- ✅ Inicia o container PostgreSQL
- ✅ Instala todas as dependências
- ✅ Gera o cliente Prisma
- ✅ Executa as migrações do banco
- ✅ Popula o banco com dados de exemplo
- ✅ Deixa tudo pronto para desenvolvimento

## 📚 API Documentation

Após iniciar a aplicação, acesse:
- **Swagger UI**: http://localhost:3000/api/v1/docs
- **API Base URL**: http://localhost:3000/api/v1
- **Status da Aplicação**: http://localhost:3000/api/v1

### Endpoints Principais

#### Sistema
- `GET /api/v1` - Status da aplicação e links úteis
- `GET /api/v1/health` - Health check

#### Produtores
- `GET /api/v1/producers` - Listar produtores
- `POST /api/v1/producers` - Criar produtor
- `GET /api/v1/producers/:id` - Buscar produtor
- `PATCH /api/v1/producers/:id` - Atualizar produtor
- `DELETE /api/v1/producers/:id` - Deletar produtor

#### Fazendas
- `GET /api/v1/farms` - Listar fazendas
- `POST /api/v1/farms` - Criar fazenda
- `GET /api/v1/farms/:id` - Buscar fazenda
- `GET /api/v1/farms/producer/:producerId` - Fazendas de um produtor
- `PATCH /api/v1/farms/:id` - Atualizar fazenda
- `DELETE /api/v1/farms/:id` - Deletar fazenda

#### Culturas
- `GET /api/v1/cultures` - Listar culturas
- `POST /api/v1/cultures` - Criar cultura
- `GET /api/v1/cultures/:id` - Buscar cultura
- `GET /api/v1/cultures/popular` - Culturas mais populares
- `PATCH /api/v1/cultures/:id` - Atualizar cultura
- `DELETE /api/v1/cultures/:id` - Deletar cultura

#### Safras
- `GET /api/v1/harvests` - Listar safras
- `POST /api/v1/harvests` - Criar safra
- `GET /api/v1/harvests/:id` - Buscar safra
- `GET /api/v1/harvests/recent` - Safras mais recentes
- `GET /api/v1/harvests/:id/stats` - Estatísticas de uma safra
- `PATCH /api/v1/harvests/:id` - Atualizar safra
- `DELETE /api/v1/harvests/:id` - Deletar safra

#### Culturas das Fazendas
- `GET /api/v1/farm-cultures` - Listar todas as associações
- `POST /api/v1/farm-cultures` - Criar associação fazenda-cultura-safra
- `GET /api/v1/farm-cultures/farm/:farmId` - Culturas de uma fazenda
- `GET /api/v1/farm-cultures/culture/:cultureId` - Fazendas que cultivam uma cultura
- `GET /api/v1/farm-cultures/harvest/:harvestId` - Associações por safra
- `GET /api/v1/farm-cultures/farm/:farmId/harvest/:harvestId` - Culturas de uma fazenda em uma safra
- `POST /api/v1/farm-cultures/farm/:farmId/culture/:cultureId` - Adicionar cultura à fazenda
- `DELETE /api/v1/farm-cultures/:id` - Remover associação por ID
- `DELETE /api/v1/farm-cultures/farm/:farmId/culture/:cultureId/harvest/:harvestId` - Remover associação específica
- `DELETE /api/v1/farm-cultures/farm/:farmId/culture/:cultureId` - Remover cultura da fazenda (todas as safras)

#### Dashboard
- `GET /api/v1/dashboard/summary` - Resumo geral
- `GET /api/v1/dashboard/charts/by-state` - Gráfico por estado
- `GET /api/v1/dashboard/charts/by-culture` - Gráfico por cultura
- `GET /api/v1/dashboard/charts/by-land-use` - Gráfico uso do solo

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```


## 🔒 Validações

### Validações Implementadas
- **CPF/CNPJ**: Validação com algoritmo de dígitos verificadores
- **Áreas**: Soma de área agricultável + vegetação ≤ área total
- **Estados**: Enum com todos os estados brasileiros
- **Anos de Safra**: Validação de anos válidos (1900 até 10 anos no futuro)
- **Campos obrigatórios**: Validação de campos obrigatórios
- **Tipos de dados**: Validação de tipos e transformações
- **Relacionamentos**: Validação de existência de entidades relacionadas

### Exemplos de Uso

#### Criar Produtor
```json
POST /api/v1/producers
{
  "name": "João Silva",
  "document": "12345678901"
}
```

#### Criar Fazenda
```json
POST /api/v1/farms
{
  "producerId": "uuid-do-produtor",
  "name": "Fazenda Santa Rita",
  "city": "Ribeirão Preto",
  "state": "SP",
  "totalArea": 1000.5,
  "arableArea": 800.3,
  "vegetationArea": 200.2
}
```

#### Criar Cultura
```json
POST /api/v1/cultures
{
  "name": "Soja"
}
```

#### Criar Safra
```json
POST /api/v1/harvests
{
  "name": "Safra 2024/2025",
  "year": 2024
}
```

#### Associar Cultura à Fazenda
```json
POST /api/v1/farm-cultures
{
  "farmId": "uuid-da-fazenda",
  "cultureId": "uuid-da-cultura",
  "harvestId": "uuid-da-safra"
}
```

## 🌍 Variáveis de Ambiente

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/brain_agriculture
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=brain_agriculture

# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📊 Dados de Exemplo

O sistema inclui um seed com dados de exemplo:
- 3 produtores com CPF e CNPJ válidos
- 3 fazendas em diferentes estados
- 5 culturas principais (Soja, Milho, Algodão, Café, Cana de Açúcar)
- 2 safras (2023 e 2024)
- Associações entre fazendas e culturas

Para executar o seed:
```bash
npm run prisma:seed
```

## 🔧 Desenvolvimento

### Adicionando um novo módulo
1. Crie a estrutura de pastas em `src/modules/`
2. Implemente o service, controller e module
3. Crie os DTOs de validação
4. Adicione o módulo no `AppModule`
5. Atualize a documentação Swagger

### Validações customizadas
As validações customizadas estão em `src/common/validators/`:
- `is-cpf-cnpj.validator.ts` - Validação de CPF/CNPJ
- `farm-area-sum.validator.ts` - Validação de soma de áreas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
