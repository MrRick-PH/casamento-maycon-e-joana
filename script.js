const form = document.getElementById('rsvp-form');
const statusDiv = document.getElementById('status');
const selectPresente = document.getElementById('presente');
const submitButton = document.getElementById('submit-btn');

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbxLq7uoBtHAHFGJa4_Odv7d5GEwu2xe4jtN8heasL3O6VI7_Mhwj00l5Reko97uWj7ONw/exec';

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
            submitButton.textContent = 'Marcar Presença';
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
    statusDiv.textContent = '';

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

        if (response.ok) {
            statusDiv.textContent = 'Cadastro concluído!';
            statusDiv.style.color = '#28a745';
            
            Array.from(selectPresente.options).forEach(option => {
                if (option.value === dataObject.presente) {
                    option.remove();
                }
            });
            form.reset();
            selectPresente.value = "";
        } else {
            throw new Error('Falha de protocolo na comunicação com o servidor.');
        }
    } catch (error) {
        statusDiv.textContent = 'Erro! Exceção não tratada na gravação dos dados.';
        statusDiv.style.color = '#dc3545';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Marcar Presença';
    }
});