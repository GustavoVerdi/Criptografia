# Criptografia

# Criptografia Simétrica e Assimétrica no Navegador

Este projeto demonstra como realizar **criptografia e descriptografia** diretamente no navegador usando **AES (simétrica)** e **RSA (assimétrica)** com a Web Crypto API do JavaScript.

---

## Funcionalidades

- Criptografia e descriptografia **simétrica (AES-GCM)**.
- Criptografia e descriptografia **assimétrica (RSA-OAEP)**.
- Geração de chaves RSA no navegador.
- Exportação das chaves RSA em arquivo JSON.
- Importação das chaves RSA para uso em outro navegador.
- Interface simples feita apenas com HTML, CSS e JavaScript puro (sem backend).

---

## Como usar

1. Abra `index.html` diretamente no navegador ou publique no GitHub Pages.
2. Digite um texto na caixa de entrada.
3. Use os botões disponíveis:
   - **Criptografar (AES)** → cifra o texto com uma chave simétrica.
   - **Descriptografar (AES)** → recupera o texto original com a chave simétrica.
   - **Gerar Chaves RSA** → cria um par de chaves pública/privada.
   - **Criptografar (RSA)** → cifra o texto com a chave pública.
   - **Descriptografar (RSA)** → recupera o texto original com a chave privada.
   - **Exportar Chaves RSA** → baixa as chaves geradas em `rsa_keys.json`.
   - **Selecionar arquivo** → importa chaves RSA previamente exportadas.

---

## Exemplo de fluxo com RSA

1. Clique em **Gerar Chaves RSA**.  
2. Clique em **Exportar Chaves RSA** e salve o arquivo.  
3. Digite um texto e clique em **Criptografar (RSA)**.  
4. Copie o texto cifrado.  
5. Em outro navegador ou dispositivo:
   - Clique em **Selecionar arquivo** e importe `rsa_keys.json`.  
   - Cole o texto cifrado e clique em **Descriptografar (RSA)** para recuperar o texto original.  

---

## Como o código funciona

O projeto usa a **Web Crypto API** do JavaScript, que permite realizar criptografia diretamente no navegador, sem precisar de bibliotecas externas.

### 1. Criptografia simétrica (AES-GCM)
- O AES usa **uma única chave secreta** para criptografar e descriptografar.  
- No código, a chave AES é gerada automaticamente na primeira vez que você clica em **Criptografar (AES)**:
  ```javascript
  aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
  );
Para cifrar, o texto é convertido em bytes (TextEncoder) e criptografado com crypto.subtle.encrypt.
Para decifrar, é usado crypto.subtle.decrypt com a mesma chave e o mesmo IV (vetor de inicialização).
O resultado é convertido para Base64 para facilitar o transporte em texto.

## Criptografia assimétrica (RSA-OAEP)
O RSA usa duas chaves diferentes:
Chave pública para criptografar.
Chave privada para descriptografar.
Ao clicar em Gerar Chaves RSA, o navegador cria um par de chaves:

rsaKeyPair = await crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
);
Para cifrar, o texto é criptografado com crypto.subtle.encrypt usando a chave pública.
Para decifrar, o texto é descriptografado com crypto.subtle.decrypt usando a chave privada.

## Exportação e importação de chaves
Para testar em diferentes navegadores, o código inclui botões para exportar e importar as chaves RSA:
Exportar: converte as chaves para Base64 e baixa um arquivo rsa_keys.json.
Importar: lê esse arquivo e recria as chaves usando crypto.subtle.importKey.

## Interface HTML
Tudo é feito em um único arquivo index.html.
Cada botão está ligado a uma função JavaScript que:
Lê o texto digitado.
Executa a criptografia ou descriptografia.
Mostra o resultado no campo de saída.

Resumindo
AES: mais rápido, mas precisa que a chave secreta seja compartilhada de forma segura.
RSA: não precisa compartilhar a chave privada, mas é mais lento.
A Web Crypto API garante que toda a criptografia é feita no próprio navegador, sem enviar dados para servidores.

Tecnologias usadas
HTML5 – interface.
CSS3 – estilo básico.
JavaScript (Web Crypto API) – criptografia nativa no navegador.

Observações
Este projeto é didático.
Para uso real em produção:
Não exponha chaves privadas.
Utilize HTTPS para segurança.
Armazene chaves e dados criptografados de forma segura.
