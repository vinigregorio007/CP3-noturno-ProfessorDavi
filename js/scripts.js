/* =====================================================
   CP3 - JavaScript do site (carregado em TODAS as paginas)

   Dados salvos no localStorage:
   - cp3_tema      : "light" ou "dark"
   - cp3_nome      : nome do visitante (boas-vindas)
   - cp3_rascunho  : JSON com o rascunho do formulario
   ===================================================== */

(function () {
    'use strict';

    var CHAVE_TEMA = 'cp3_tema';
    var CHAVE_NOME = 'cp3_nome';
    var CHAVE_RASCUNHO = 'cp3_rascunho';

    /* ---------- Acesso seguro ao localStorage ---------- */
    function ler(chave) {
        try {
            return localStorage.getItem(chave);
        } catch (e) {
            return null;
        }
    }

    function gravar(chave, valor) {
        try {
            localStorage.setItem(chave, valor);
            return true;
        } catch (e) {
            return false;
        }
    }

    function remover(chave) {
        try {
            localStorage.removeItem(chave);
        } catch (e) { /* ignora */ }
    }

    /* ---------- 1. Tema claro/escuro ---------- */
    // Aplicado imediatamente (script no <head>) para nao "piscar" ao carregar
    function temaInicial() {
        var salvo = ler(CHAVE_TEMA);
        if (salvo === 'dark' || salvo === 'light') {
            return salvo;
        }
        var prefereEscuro = window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefereEscuro ? 'dark' : 'light';
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-tema', tema);
    }

    aplicarTema(temaInicial());

    function criarBotaoTema() {
        var lista = document.querySelector('header nav ul');
        if (!lista) { return; }

        var item = document.createElement('li');
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'btn-tema';
        item.appendChild(botao);
        lista.appendChild(item);

        function atualizarRotulo() {
            var escuro = document.documentElement.getAttribute('data-tema') === 'dark';
            botao.textContent = escuro ? '☀️ Tema claro' : '🌙 Tema escuro';
            botao.setAttribute('aria-pressed', escuro ? 'true' : 'false');
        }

        botao.addEventListener('click', function () {
            var atual = document.documentElement.getAttribute('data-tema');
            var novo = atual === 'dark' ? 'light' : 'dark';
            aplicarTema(novo);
            gravar(CHAVE_TEMA, novo);
            atualizarRotulo();
        });

        atualizarRotulo();
    }

    /* ---------- 2. Boas-vindas com o nome do visitante ---------- */
    function criarBarraBoasVindas() {
        var header = document.querySelector('header');
        if (!header) { return; }

        var barra = document.createElement('div');
        barra.className = 'barra-boasvindas';
        barra.setAttribute('aria-live', 'polite');
        header.insertAdjacentElement('afterend', barra);

        function mostrarPergunta() {
            barra.textContent = '';
            var conteudo = document.createElement('form');
            conteudo.className = 'barra-conteudo';

            var rotulo = document.createElement('label');
            rotulo.htmlFor = 'campo-nome-visitante';
            rotulo.textContent = 'Primeira visita? Como posso te chamar?';
            rotulo.style.margin = '0';

            var campo = document.createElement('input');
            campo.type = 'text';
            campo.id = 'campo-nome-visitante';
            campo.maxLength = 40;
            campo.autocomplete = 'given-name';
            campo.placeholder = 'Seu nome';

            var botao = document.createElement('button');
            botao.type = 'submit';
            botao.textContent = 'Salvar';

            conteudo.appendChild(rotulo);
            conteudo.appendChild(campo);
            conteudo.appendChild(botao);
            barra.appendChild(conteudo);

            conteudo.addEventListener('submit', function (evento) {
                evento.preventDefault();
                var nome = campo.value.trim();
                if (nome.length < 2) {
                    campo.focus();
                    campo.placeholder = 'Digite pelo menos 2 letras';
                    return;
                }
                gravar(CHAVE_NOME, nome);
                mostrarSaudacao(nome);
            });
        }

        function mostrarSaudacao(nome) {
            barra.textContent = '';
            var conteudo = document.createElement('div');
            conteudo.className = 'barra-conteudo';

            var texto = document.createElement('p');
            texto.textContent = 'Olá, ' + nome + '! 👋 Que bom te ver por aqui.';

            var trocar = document.createElement('button');
            trocar.type = 'button';
            trocar.className = 'secundario';
            trocar.textContent = 'Não sou eu';
            trocar.addEventListener('click', function () {
                remover(CHAVE_NOME);
                mostrarPergunta();
            });

            conteudo.appendChild(texto);
            conteudo.appendChild(trocar);
            barra.appendChild(conteudo);
        }

        var nomeSalvo = ler(CHAVE_NOME);
        if (nomeSalvo) {
            mostrarSaudacao(nomeSalvo);
        } else {
            mostrarPergunta();
        }
    }

    /* ---------- 3. Formulario: mascaras, validacao e rascunho ---------- */
    function soDigitos(texto) {
        return texto.replace(/\D/g, '');
    }

    function mascaraCPF(v) {
        var d = soDigitos(v).slice(0, 11);
        return d.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function mascaraCEP(v) {
        return soDigitos(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    }

    function mascaraTelefone(v) {
        var d = soDigitos(v).slice(0, 11);
        if (d.length <= 10) {
            return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
        }
        return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }

    // Confere os dois digitos verificadores do CPF
    function cpfValido(valor) {
        var d = soDigitos(valor);
        if (d.length !== 11 || /^(\d)\1+$/.test(d)) { return false; }
        for (var t = 9; t < 11; t++) {
            var soma = 0;
            for (var i = 0; i < t; i++) {
                soma += Number(d.charAt(i)) * (t + 1 - i);
            }
            var digito = ((soma * 10) % 11) % 10;
            if (digito !== Number(d.charAt(t))) { return false; }
        }
        return true;
    }

    // Cada regra devolve uma mensagem de erro ou "" quando o campo esta ok
    var regras = {
        nome: function (v) {
            if (v.trim().length === 0) { return 'Informe seu nome.'; }
            if (v.trim().length < 3) { return 'O nome precisa ter pelo menos 3 letras.'; }
            return '';
        },
        email: function (v) {
            if (v.trim().length === 0) { return 'Informe seu e-mail.'; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
                return 'E-mail inválido. Exemplo: nome@dominio.com';
            }
            return '';
        },
        telefone: function (v) {
            if (v.trim() === '') { return ''; }
            var n = soDigitos(v).length;
            if (n < 10 || n > 11) { return 'Telefone inválido. Use DDD + número.'; }
            return '';
        },
        cpf: function (v) {
            if (v.trim() === '') { return ''; }
            return cpfValido(v) ? '' : 'CPF inválido. Confira os números.';
        },
        cep: function (v) {
            if (v.trim() === '') { return ''; }
            return soDigitos(v).length === 8 ? '' : 'CEP inválido. Use o formato 00000-000.';
        },
        nascimento: function (v) {
            if (v === '') { return ''; }
            var data = new Date(v + 'T00:00:00');
            if (isNaN(data.getTime()) || data > new Date()) {
                return 'A data de nascimento não pode estar no futuro.';
            }
            return '';
        },
        mensagem: function (v) {
            if (v.trim().length === 0) { return 'Escreva uma mensagem.'; }
            if (v.trim().length < 10) { return 'A mensagem precisa ter pelo menos 10 caracteres.'; }
            return '';
        }
    };

    function iniciarFormulario() {
        var form = document.getElementById('form-contato');
        if (!form) { return; }

        var msgGeral = document.getElementById('msg-form');
        var statusRascunho = document.getElementById('status-rascunho');
        var camposTexto = ['nome', 'email', 'telefone', 'cpf', 'cep', 'nascimento', 'mensagem'];
        var camposRascunho = camposTexto.concat(['cor', 'interesse']);

        function mostrarMensagem(tipo, texto) {
            msgGeral.hidden = false;
            msgGeral.className = 'msg-form ' + (tipo === 'ok' ? 'msg-sucesso' : 'msg-erro');
            msgGeral.textContent = texto;
        }

        function validarCampo(nome) {
            var campo = form.elements[nome];
            var erro = document.getElementById('erro-' + nome);
            var mensagem = regras[nome](campo.value);

            erro.textContent = mensagem;
            if (mensagem) {
                campo.classList.add('invalido');
                campo.classList.remove('valido');
                campo.setAttribute('aria-invalid', 'true');
            } else {
                campo.classList.remove('invalido');
                campo.setAttribute('aria-invalid', 'false');
                if (campo.value.trim() !== '') {
                    campo.classList.add('valido');
                } else {
                    campo.classList.remove('valido');
                }
            }
            return mensagem === '';
        }

        function limparValidacao() {
            camposTexto.forEach(function (nome) {
                var campo = form.elements[nome];
                campo.classList.remove('invalido', 'valido');
                campo.removeAttribute('aria-invalid');
                document.getElementById('erro-' + nome).textContent = '';
            });
        }

        // Mascaras
        form.elements.cpf.addEventListener('input', function (e) {
            e.target.value = mascaraCPF(e.target.value);
        });
        form.elements.cep.addEventListener('input', function (e) {
            e.target.value = mascaraCEP(e.target.value);
        });
        form.elements.telefone.addEventListener('input', function (e) {
            e.target.value = mascaraTelefone(e.target.value);
        });

        // Validacao ao sair do campo
        camposTexto.forEach(function (nome) {
            form.elements[nome].addEventListener('blur', function () {
                validarCampo(nome);
            });
        });

        // Valor do controle deslizante
        var saidaInteresse = document.getElementById('saida-interesse');
        function atualizarInteresse() {
            saidaInteresse.textContent = form.elements.interesse.value + ' / 10';
        }

        // --- Rascunho (localStorage) ---
        var temporizador = null;

        function salvarRascunho() {
            var dados = {};
            camposRascunho.forEach(function (nome) {
                dados[nome] = form.elements[nome].value;
            });
            var ok = gravar(CHAVE_RASCUNHO, JSON.stringify(dados));
            var hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            statusRascunho.textContent = ok
                ? 'Rascunho salvo automaticamente às ' + hora + '.'
                : 'Não foi possível salvar o rascunho neste navegador.';
        }

        function restaurarRascunho() {
            var bruto = ler(CHAVE_RASCUNHO);
            if (!bruto) { return; }
            try {
                var dados = JSON.parse(bruto);
                camposRascunho.forEach(function (nome) {
                    if (typeof dados[nome] === 'string') {
                        form.elements[nome].value = dados[nome];
                    }
                });
                statusRascunho.textContent = 'Rascunho anterior restaurado. Você pode continuar de onde parou.';
            } catch (e) {
                remover(CHAVE_RASCUNHO);
            }
        }

        form.addEventListener('input', function () {
            atualizarInteresse();
            clearTimeout(temporizador);
            temporizador = setTimeout(salvarRascunho, 400);
        });

        // Envio
        form.addEventListener('submit', function (evento) {
            evento.preventDefault();

            var primeiroInvalido = null;
            camposTexto.forEach(function (nome) {
                if (!validarCampo(nome) && !primeiroInvalido) {
                    primeiroInvalido = form.elements[nome];
                }
            });

            if (primeiroInvalido) {
                mostrarMensagem('erro', 'Corrija os campos destacados antes de enviar.');
                primeiroInvalido.focus();
                return;
            }

            // Site estatico: nao ha servidor, entao so confirmamos o recebimento na tela
            var primeiroNome = form.elements.nome.value.trim().split(' ')[0];
            mostrarMensagem('ok', 'Obrigado, ' + primeiroNome + '! Sua mensagem foi validada com sucesso.');
            clearTimeout(temporizador);
            remover(CHAVE_RASCUNHO);
            form.reset();
            limparValidacao();
            atualizarInteresse();
            statusRascunho.textContent = 'Rascunho apagado após o envio.';
        });

        // Botao "Limpar"
        form.addEventListener('reset', function () {
            clearTimeout(temporizador);
            remover(CHAVE_RASCUNHO);
            limparValidacao();
            msgGeral.hidden = true;
            statusRascunho.textContent = 'Formulário limpo e rascunho apagado.';
            // o reset restaura o valor padrao depois deste evento
            setTimeout(atualizarInteresse, 0);
        });

        restaurarRascunho();
        atualizarInteresse();
    }

    /* ---------- 4. Canvas (pagina de graficos) ---------- */
    function desenharCanvas() {
        var canvas = document.getElementById('meu-canvas');
        if (!canvas || !canvas.getContext) { return; }
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = '#3498db';
        ctx.fillRect(20, 20, 140, 90);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, 140, 90);

        ctx.beginPath();
        ctx.arc(260, 65, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#2ecc71';
        ctx.fill();
        ctx.strokeStyle = '#27ae60';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(90, 270);
        ctx.lineTo(150, 150);
        ctx.lineTo(210, 270);
        ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = '#c0392b';
        ctx.stroke();

        ctx.fillStyle = '#354656';
        ctx.font = 'bold 16px Segoe UI, Arial, sans-serif';
        ctx.fillText('Canvas + JavaScript', 200, 250);
    }

    /* ---------- Inicializacao ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        criarBotaoTema();
        criarBarraBoasVindas();
        iniciarFormulario();
        desenharCanvas();
    });
})();
