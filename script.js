const steps = document.querySelectorAll(".form-step");
const progress = document.getElementById("progress");
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
  updateProgress();
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function updateProgress() {
  const percent = (currentStep / (steps.length - 1)) * 100;
  progress.style.width = percent + "%";
}

function toggleDoc() {
    const docType = document.querySelector('input[name="Tipo-de-cadastro"]:checked').value;

    document.querySelector('input[name="Nome"]').dataset.required = docType === 'CPF' ? "true" : "false"
    document.querySelector('input[name="CPF"]').dataset.required = docType === 'CPF' ? "true" : "false"
    document.querySelector('input[name="Razao-Social"]').dataset.required = docType === 'CNPJ' ? "true" : "false"
    document.querySelector('input[name="CNPJ"]').dataset.required = docType === 'CNPJ' ? "true" : "false"

    document.querySelector('.cpf-div').style.display = docType === 'CPF' ? 'block' : 'none';
    document.querySelector('.cnpj-div').style.display = docType === 'CNPJ' ? 'block' : 'none';
}



document.getElementById('cpfField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); 
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('cnpjField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('telField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  e.target.value = value;
});
document.getElementById('cepField').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  e.target.value = value;
});

//Carrega as informações de endereço pelo CEP inserido 
document.getElementById('cepField').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');

  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById('rua').value = data.logradouro || '';
          document.getElementById('bairro').value = data.bairro || '';
          document.getElementById('cidade').value = data.localidade || '';
          document.getElementById('estado').value = data.uf || '';
        } else {
          alert('CEP não encontrado!');
        }
      })
      .catch(() => alert('Erro ao buscar CEP.'));
  }
});

//Estilização do input file
document.getElementById('fileField').addEventListener('change', function () {
  const lista = document.getElementById('filesList');
  lista.innerHTML = '';

  if (this.files.length === 0) {
    lista.innerHTML = '<li>Nenhum arquivo selecionado</li>';
    return;
  }

  for (const file of this.files) {
    const li = document.createElement('li');
    li.textContent = file.name;
    lista.appendChild(li);
  }
});



//Validação de formulário
document.getElementById('multiStepForm').addEventListener('submit', function (e) {
  const campos = this.querySelectorAll('[data-required="true"]');
  let faltando = [];
  const form = this;

  campos.forEach(campo => {
    if ((campo.type === 'file' && campo.files.length === 0) || (campo.type !== 'file' && !campo.value.trim())) {
      faltando.push(campo.name);
    }
  });

  if (faltando.length > 0) {
    e.preventDefault();
    alert(`Preencha todos os campos obrigatórios!\nFaltando: ${faltando.join(', ')}`);
    return;
  }
  HTMLFormElement.prototype.submit.call(form);
});



// Inicializar
showStep(currentStep);
