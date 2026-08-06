# 📋 GUIA DEFINITIVO DE RESTAURAÇÃO DO PROJETO OLHO VIVO (PÓS-FORMATAÇÃO DO WINDOWS)

Este guia contém todas as instruções e comandos necessários para realizar o backup antes de formatar seu Windows e reconfigurar 100% do ambiente do **Projeto Olho Vivo** após a formatação.

---

## 💾 PARTE 1: O QUE FAZER ANTES DE FORMATAR (BACKUP)

### 1. Salvar suas Chaves SSH (Acesso ao GitHub)
Copie a pasta `.ssh` inteira do seu Windows atual para um pendrive ou nuvem (Google Drive, OneDrive, etc.):
- **Caminho original:** `C:\Users\Junior\.ssh`
- **Arquivos principais:** `id_rsa`, `id_rsa.pub` ou `id_ed25519`, `id_ed25519.pub`, `known_hosts`.

> 💡 *Se você não tiver backup dessa pasta, não tem problema: criaremos uma nova chave no GitHub em 1 minuto na Parte 2.*

### 2. Confirmar que o código está salvo no GitHub
Seu projeto local já está 100% commitado e sincronizado com o repositório remoto na branch `demo`.
- **Repositório:** `https://github.com/juniorrosa12/Projeto_Olho_Vivo.git`
- **Branch principal de desenvolvimento:** `demo`

---

## 🚀 PARTE 2: RECONFIGURAÇÃO PÓS-FORMATAÇÃO (PASSO A PASSO)

### 📥 Passo 1: Instalar Programas Necessários no Novo Windows

Abra o **PowerShell como Administrador** no Windows novo e execute os comandos abaixo para instalar o Git, VS Code e NetBird automaticamente via `winget`:

```powershell
# Instalar Git
winget install --id Git.Git -e --source winget

# Instalar VS Code
winget install --id Microsoft.VisualStudioCode -e

# Instalar NetBird VPN
winget install --id NetBird.NetBird -e
```

*(Caso prefira, você também pode baixar os instaladores manualmente pelos sites oficiais).*

---

### 🔑 Passo 2: Configurar o Git e Autenticação no GitHub

Após instalar o Git, abra o **PowerShell** ou **Git Bash**:

1. **Configurar seu Nome e E-mail no Git:**
   ```powershell
   git config --global user.name "Junior Rosa"
   git config --global user.email "seu-email-do-github@exemplo.com"
   ```

2. **Restaurar ou Gerar Chave SSH para o GitHub:**
   - **Opção A (Restaurar Chave Salva):** Copie a pasta `.ssh` do seu backup para `C:\Users\SeuNovoUsuario\.ssh`.
   - **Opção B (Gerar Nova Chave):**
     ```powershell
     ssh-keygen -t ed25519 -C "seu-email-do-github@exemplo.com"
     ```
     Pressione `Enter` em todas as perguntas. Depois exiba a chave pública para copiar:
     ```powershell
     Get-Content ~\ .ssh\id_ed25519.pub
     ```
     Copie o texto gerado, vá em **GitHub ➔ Settings ➔ SSH and GPG keys ➔ New SSH key** e cole lá.

3. **Testar conexão com o GitHub:**
   ```powershell
   ssh -T git@github.com
   ```
   *(Deve retornar: `Hi juniorrosa12! You've successfully authenticated...`)*

---

### 🌐 Passo 3: Conectar o NetBird no Windows

1. Abra o aplicativo **NetBird** instalado no menu Iniciar do Windows e clique em **Connect** (ou faça login com sua conta).
2. Ou via **PowerShell (como Administrador)**:
   ```powershell
   & "C:\Program Files\NetBird\netbird.exe" up
   ```
   *(Se pedir chave de instalação, use a Setup Key do seu painel no [app.netbird.io](https://app.netbird.io)).*

3. **Verificar se a rede VPN conectou com o Servidor Ubuntu:**
   ```powershell
   & "C:\Program Files\NetBird\netbird.exe" status
   ```

4. **Testar comunicação com a rede do servidor:**
   ```powershell
   ping 192.168.3.12
   ping 100.97.213.43
   ```

---

### 📦 Passo 4: Clonar o Repositório do Projeto no Windows

Abra o terminal na pasta onde costuma guardar seus projetos (ex: `C:\Projetos` ou `C:\Users\SeuUsuario\Projetos`):

```powershell
# Criar diretório de projetos (opcional)
mkdir C:\Projetos -ErrorAction SilentlyContinue
cd C:\Projetos

# Clonar repositório selecionando a branch demo
git clone -b demo https://github.com/juniorrosa12/Projeto_Olho_Vivo.git

# Entrar na pasta do projeto
cd Projeto_Olho_Vivo
```

---

### 🖥️ Passo 5: Acessar o Servidor Ubuntu e Gerenciar o Projeto Docker

Como todo o processamento pesado (Backend FastAPI, Vision YOLO11 e PostgreSQL) roda no seu Servidor Ubuntu, você pode acessar e controlar tudo via SSH a partir do seu Windows novinho:

1. **Conectar via SSH no Servidor Ubuntu:**
   ```powershell
   ssh olho@192.168.3.12
   ```
   *(ou via IP NetBird: `ssh olho@100.97.213.43`)*

2. **No terminal do Servidor Ubuntu, atualizar o projeto e subir os containers:**
   ```bash
   cd ~/Projetos/Projeto_Olho_Vivo
   git pull origin demo
   docker compose up -d
   ```

3. **Verificar o status dos containers no Ubuntu:**
   ```bash
   docker compose ps
   ```
   *(Todos os serviços `backend`, `frontend`, `vision`, `postgres` e `redis` devem aparecer como `Up`)*.

---

### 🌐 Passo 6: Acessar o Sistema no Navegador

Abra qualquer navegador no seu Windows recém-formatado e acesse:

- **Sistema Olho Vivo (Painel / Mosaico ao Vivo):**
  `http://192.168.3.12:5173/detection`  *(ou `http://100.97.213.43:5173/detection` via NetBird)*

- **Swagger da API (Backend):**
  `http://192.168.3.12:8000/docs`

---

## 📌 RESUMO RÁPIDO DE COMANDOS (PARA COPIAR E COLAR NO NOVO WINDOWS)

```powershell
# 1. Instalar programas essenciais
winget install --id Git.Git -e --source winget
winget install --id Microsoft.VisualStudioCode -e
winget install --id NetBird.NetBird -e

# 2. Configurar Git
git config --global user.name "Junior Rosa"
git config --global user.email "seu-email@exemplo.com"

# 3. Conectar NetBird
& "C:\Program Files\NetBird\netbird.exe" up

# 4. Clonar Repositório
cd C:\Projetos
git clone -b demo https://github.com/juniorrosa12/Projeto_Olho_Vivo.git
cd Projeto_Olho_Vivo

# 5. SSH no Servidor Ubuntu para garantir containers Up
ssh olho@192.168.3.12 "cd ~/Projetos/Projeto_Olho_Vivo && git pull origin demo && docker compose up -d && docker compose ps"
```

---
*Guia gerado pelo Antigravity AI para o Projeto Olho Vivo.*
