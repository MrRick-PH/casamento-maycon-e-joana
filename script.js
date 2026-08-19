const form = document.getElementById('rsvp-form');
const statusDiv = document.getElementById('status');
const selectPresente = document.getElementById('presente');
const submitButton = document.getElementById('submit-btn');

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwhzAt5XO6nlEqGq6zWPUUvKqV4Z447JJxchdy682v9duFIxXoIqXpIsKsNvlSewXvE3g/exec';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(ENDPOINT_URL);
        const result = await response.json();

        if (result.status === 'success') {
            selectPresente.innerHTML = '<option value="" disabled selected>Selecione um item disponível</option>';
            
            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectPresente.appendChild(option);
            });
            
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Presença';
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        selectPresente.innerHTML = '<option value="" disabled selected>Falha no subsistema de leitura</option>';
        statusDiv.textContent = 'Erro crítico de inicialização. ' + error.message;
        statusDiv.style.color = '#dc3545';
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Processando...';

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
            body: JSON.stringify(dataObject),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert('Presença Confirmada com sucesso!');
            
            Array.from(selectPresente.options).forEach(option => {
                if (option.value === dataObject.presente) {
                    option.remove();
                }
            });
            form.reset();
            selectPresente.value = "";
        } else {
            throw new Error(result.message || 'Falha de conexão. Verifique o acesso à internet e repita a operação.');
        }
    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar Presença';
    }
});