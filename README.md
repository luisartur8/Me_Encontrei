# Me_Encontrei
TCC - Esucri

## Passo a passo pra rodar o backend no desenvolvimento
- Renomear o .env.example pra .env e configurar as variáveis (Cria um banco 'me_encontrei', etc)
- npx prisma migrate dev (O banco tem que estar criado, gera as tabelas de acordo com schema.prisma)
- npm run seed (Cria usuário no banco (admin e default_user))
- npm run start:dev
- localhost:3333/docs (Ve a documentação usando swagger, mostra todas as rotas)