const form = document.getElementById('rsvp-form');
const statusDiv = document.getElementById('status');

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbxLq7uoBtHAHFGJa4_Odv7d5GEwu2xe4jtN8heasL3O6VI7_Mhwj00l5Reko97uWj7ONw/exec';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button');
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
            statusDiv.textContent = 'Transação efetuada com sucesso.';
            statusDiv.style.color = '#28a745';
            form.reset();
        } else {
            throw new Error('Falha de resposta do servidor remoto.');
        }
    } catch (error) {
        statusDiv.textContent = 'Erro de transação. Falha no envio dos pacotes.';
        statusDiv.style.color = '#dc3545';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submeter Dados';
    }
});