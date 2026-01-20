# 🟢 Cloud-Native Blog

Projeto **cloud-native** desenvolvido como parte do bootcamp da **Digital Innovation One (DIO)**, com foco em arquitetura de microserviços, containers e serviços gerenciados da **Microsoft Azure**.

O objetivo do projeto é demonstrar, de forma prática, como aplicações modernas podem ser estruturadas utilizando **Gateway + Microservices + Cloud Storage**, seguindo boas práticas de computação em nuvem.

---

## 🧠 Visão Geral da Arquitetura

A aplicação é composta por três serviços principais:

- **NGINX Gateway**
  - Atua como ponto de entrada da aplicação (API Gateway + Frontend)
  - Responsável por rotear as requisições para os microserviços

- **CreatePost Service**
  - Microserviço responsável pela criação de posts
  - Persiste os dados no **Azure Blob Storage**

- **ListPost Service**
  - Microserviço responsável pela listagem dos posts
  - Consome os dados diretamente do **Azure Blob Storage**

Todos os serviços são executados em **containers Docker**, garantindo isolamento, portabilidade e fácil deploy em ambientes cloud.

---

## 🏗️ Arquitetura (Visão Lógica)

[ Browser ]
|
v
[ NGINX Gateway ]
| |
v v
[ CreatePost ] [ ListPost ]
\ /
\ /
[ Azure Blob Storage ]


---

## 🛠️ Stack Utilizada

### Backend
- Node.js 20
- Express.js

### Gateway / Frontend
- NGINX (alpine)
- HTML + CSS + JavaScript

### Cloud
- Microsoft Azure
  - Azure Blob Storage
  - Azure Resource Groups

### Infraestrutura
- Docker
- Azure CLI

---

## 📁 Estrutura do Projeto

cloud-native-blog/
│
├── gateway/
│ ├── Dockerfile
│ ├── entrypoint.sh
│ ├── index.html
│ └── nginx.template.conf
│
├── services/
│ ├── create-post/
│ │ ├── Dockerfile
│ │ ├── package.json
│ │ └── server.js
│ │
│ └── list-post/
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
│
├── images/
│ └── demo.png
│
└── README.md


---

## ▶️ Como Executar Localmente

### Pré-requisitos
- Docker
- Azure CLI
- Conta Azure ativa

---

### 1️⃣ Provisionar recursos no Azure
- Criar um **Resource Group**
- Criar um **Storage Account**
- Criar um **Blob Container** chamado `posts`

---

### 2️⃣ Build das imagens Docker

```bash
docker build -t cnb-create:local ./services/create-post
docker build -t cnb-list:local ./services/list-post
docker build -t cnb-gateway:local ./gateway
```
3️⃣ Executar os containers

CreatePost
```
docker run --rm -p 3001:3000 \
  -e AZURE_STORAGE_CONNECTION_STRING="<CONNECTION_STRING>" \
  -e POSTS_CONTAINER="posts" \
  cnb-create:local
```
ListPost
```
docker run --rm -p 3002:3000 \
  -e AZURE_STORAGE_CONNECTION_STRING="<CONNECTION_STRING>" \
  -e POSTS_CONTAINER="posts" \
  cnb-list:local
```
Gateway
```
docker run --rm -p 8081:80 \
  -e CREATE_URL=http://host.docker.internal:3001/ \
  -e LIST_URL=http://host.docker.internal:3002/ \
  cnb-gateway:local
```
4️⃣ Acessar a aplicação
```
http://localhost:8081
```
✅ Funcionalidades Implementadas
Criar posts com:

Título

Autor

Conteúdo

Listar posts persistidos

Persistência real em Azure Blob Storage

Comunicação entre microserviços via Gateway

Arquitetura baseada em containers

📸 Demonstração
Print real da aplicação rodando localmente com persistência na Azure:

Adicionar imagem em: ./images/demo.png
🎯 Aprendizados com o Projeto
Arquitetura Cloud-Native

Microserviços com Node.js

Azure Blob Storage

Containerização com Docker

Gateway com NGINX

Integração frontend + backend

Provisionamento de recursos via Azure CLI

Boas práticas de separação de responsabilidades

🚀 Próximos Passos (Evoluções)
Deploy em Azure Container Apps

Uso do Azure Container Registry (ACR)

Exposição pública com HTTPS

Health checks no Gateway

Observabilidade (logs e métricas)

👨‍💻 Autor
Luiz Felipe Carvalho Nascimento

GitHub: https://github.com/luizcarvalho20
Linkedin: https://linkedin.com/in/luizcarvalho20
