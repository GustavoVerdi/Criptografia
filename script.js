let aesKey;
let rsaKeyPair;
let encryptedAES;
let encryptedRSA;

async function encryptSymmetric() {
    const text = document.getElementById("inputText").value;
    if (!text) return alert("Digite algum texto!");

    if (!aesKey) {
        aesKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        data
    );

    encryptedAES = { iv: Array.from(iv), data: Array.from(new Uint8Array(cipherBuffer)) };
    document.getElementById("output").textContent = 
        "Texto criptografado com AES:\n" + JSON.stringify(encryptedAES, null, 2);
}

async function decryptSymmetric() {
    if (!encryptedAES || !aesKey) return alert("Não há dados AES para descriptografar!");

    const iv = new Uint8Array(encryptedAES.iv);
    const cipherBytes = new Uint8Array(encryptedAES.data);

    try {
        const plainBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            aesKey,
            cipherBytes
        );
        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(plainBuffer);

        document.getElementById("output").textContent = 
            "Texto descriptografado com AES:\n" + decryptedText;
    } catch (e) {
        alert("Erro na descriptografia AES: " + e.message);
    }
}

async function generateRSAKeys() {
    rsaKeyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
    alert("Chaves RSA geradas com sucesso!");
}

async function encryptAsymmetric() {
    if (!rsaKeyPair) return alert("Gere as chaves RSA primeiro!");
    const text = document.getElementById("inputText").value;
    if (!text) return alert("Digite algum texto!");

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaKeyPair.publicKey,
        data
    );

    encryptedRSA = Array.from(new Uint8Array(cipherBuffer));
    document.getElementById("output").textContent =
        "Texto criptografado com RSA:\n" + JSON.stringify(encryptedRSA, null, 2);
}

async function decryptAsymmetric() {
    if (!rsaKeyPair || !encryptedRSA) return alert("Não há dados RSA para descriptografar!");

    const cipherBytes = new Uint8Array(encryptedRSA);

    try {
        const plainBuffer = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            rsaKeyPair.privateKey,
            cipherBytes
        );
        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(plainBuffer);

        document.getElementById("output").textContent =
            "Texto descriptografado com RSA:\n" + decryptedText;
    } catch (e) {
        alert("Erro na descriptografia RSA: " + e.message);
    }
}

async function exportRSAKeys() {
    if (!rsaKeyPair) return alert("Gere as chaves RSA primeiro!");

    const publicKey = await window.crypto.subtle.exportKey("spki", rsaKeyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", rsaKeyPair.privateKey);

    const exported = {
        publicKey: arrayBufferToBase64(publicKey),
        privateKey: arrayBufferToBase64(privateKey)
    };

    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsa_keys.json";
    a.click();
    URL.revokeObjectURL(url);
}

async function importRSAKeys(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const keyData = JSON.parse(e.target.result);

        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            base64ToArrayBuffer(keyData.publicKey),
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"]
        );

        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            base64ToArrayBuffer(keyData.privateKey),
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["decrypt"]
        );

        rsaKeyPair = { publicKey, privateKey };
        alert("Chaves importadas com sucesso!");
    };
    reader.readAsText(file);
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}
