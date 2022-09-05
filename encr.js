window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    console.log(msg, url, linenumber);
    return true;
}

function id(a) {
    return document.getElementById(a);
}

function keygen() {
    const key = sodium.crypto_box_keypair();
    id("pubkey").value = base64encode(key.publicKey);
    id("privkey").value = base64encode(key.privateKey);
}

function encrypt() {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const message = new TextEncoder().encode(id("encrypt_msg").value);
    const recipient_pubkey = base64decode(id("encrypt_pubkey").value);
    const sender_privkey = base64decode(id("privkey").value);
    const boxed = sodium.crypto_box_easy(message, nonce, recipient_pubkey, sender_privkey);
    id("encrypt_res").value = base64encode(nonce) + "*" + base64encode(boxed);
}

function decrypt() {
    const [nonce_b64, ciphertext_b64] = id("decrypt_msg").value.split("*");
    const nonce = base64decode(nonce_b64);
    const ciphertext = base64decode(ciphertext_b64);
    const sender_pubkey = base64decode(id("decrypt_pubkey").value);
    const recipient_privkey = base64decode(id("privkey").value);
    console.log(ciphertext, nonce, sender_pubkey, recipient_privkey);
    const boxed = sodium.crypto_box_open_easy(ciphertext, nonce, sender_pubkey, recipient_privkey);
    id("decrypt_res").value = new TextDecoder().decode(boxed);
}

function showhidepassword() {
    id("privkey").setAttribute("type", id("privkey").getAttribute("type") === "password" ? "" : "password");
}

(async() => {
    await sodium.ready;

    id("target").innerHTML = `
        <label>public key
        <input id="pubkey" style="width:100%" rows=1 />
        </label>
        <label>private key
        <input id="privkey" type="password" style="width:100%" rows=1 />
        </label><button onClick="showhidepassword()">showhide</button>
        <h1>keygen</h1>
        <button onClick="keygen()">keygen</button><br/>
        <h1>encrypt</h1>
        <label>recipient public key
        <input id="encrypt_pubkey" style="width:100%" rows=1 />
        </label>
        <label>secret message
        <textarea id="encrypt_msg" style="width:100%" rows=4></textarea>
        </label>
        <button onClick="encrypt()">→</button>
        <label>encrypted result
        <input id="encrypt_res" style="width:100%" rows=1 />
        </label>
        <h1>decrypt</h1>
        <label>sender public key
        <input id="decrypt_pubkey" style="width:100%" rows=1 />
        </label>
        <label>encrypted message
        <input id="decrypt_msg" style="width:100%" rows=1 />
        </label>
        <button onClick="decrypt()">→</button>
        <label>decrypted result
        <textarea id="decrypt_res" style="width:100%" rows=4></textarea>
        </label>
    `;
})();

function base64encode(v) {
	return btoa(String.fromCharCode(...v));
}
function base64decode(v) {
    return Uint8Array.from(atob(v), c => c.charCodeAt(0));
}