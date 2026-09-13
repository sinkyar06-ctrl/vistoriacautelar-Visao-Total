// ================================
// Visão Total - Script Principal
// ================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Header scroll effect ----
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Botão voltar ao topo
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Menu mobile ----
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ---- Navegação ativa por scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ---- Voltar ao topo ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ---- Animação de entrada dos elementos ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        '.diferencial-card, .servico-card, .empresa-card, .info-item, .sobre-image, .sobre-content'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Adicionar classe para animar
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ---- Formulário de contato ----
    const contatoForm = document.getElementById('contatoForm');

    contatoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coletar dados
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servico = document.getElementById('servico').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        // Validação básica
        if (!nome || !email || !telefone || !servico) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        // Simular envio (aqui você pode integrar com seu backend)
        const btn = contatoForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            // Montar mensagem para WhatsApp
            const mensagemWhats = `*Nova Mensagem - Visão Total*%0A%0A` +
                `*Nome:* ${nome}%0A` +
                `*E-mail:* ${email}%0A` +
                `*Telefone:* ${telefone}%0A` +
                `*Serviço:* ${servico}%0A` +
                `*Mensagem:* ${mensagem || 'Não informada'}`;

            const whatsappUrl = `https://wa.me/551136214451?text=${mensagemWhats}`;

            showNotification('Mensagem preparada! Você será redirecionado para o WhatsApp.', 'success');

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                contatoForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        }, 1000);
    });

    // ---- Sistema de notificações ----
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animação de entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Remover após 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ---- Máscara de telefone ----
    const telefoneInput = document.getElementById('telefone');

    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
        }

        e.target.value = value;
    });

    // ---- Smooth scroll para links internos ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Animação dos números (contador) ----
    const heroStats = document.querySelectorAll('.stat-item strong');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;

                // Só anima se contiver números
                if (/\d/.test(text)) {
                    animateCounter(el, text);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    heroStats.forEach(stat => counterObserver.observe(stat));

    function animateCounter(element, originalText) {
        const match = originalText.match(/(\d+)/);
        if (!match) return;

        const targetNumber = parseInt(match[1]);
        const prefix = originalText.substring(0, match.index);
        const suffix = originalText.substring(match.index + match[1].length);
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * targetNumber);

            element.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = originalText;
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Adicionar CSS das notificações dinamicamente ----
    const notifStyle = document.createElement('style');
    notifStyle.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            font-size: 0.92rem;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 380px;
            border-left: 4px solid #003d7a;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-success {
            border-left-color: #00c2a8;
        }

        .notification-success i {
            color: #00c2a8;
            font-size: 1.3rem;
        }

        .notification-error {
            border-left-color: #ef4444;
        }

        .notification-error i {
            color: #ef4444;
            font-size: 1.3rem;
        }

        .notification-info {
            border-left-color: #003d7a;
        }

        .notification-info i {
            color: #003d7a;
            font-size: 1.3rem;
        }

        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
                top: 80px;
            }
        }
    `;
    document.head.appendChild(notifStyle);

    // ---- Efeito parallax suave no hero ----
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        }, { passive: true });
    }

    // ---- Console personalizado ----
    console.log(
        '%c🚗 Visão Total - Vistoria Veicular',
        'background: linear-gradient(135deg, #ff6b00, #003d7a); color: #fff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 8px;'
    );
    console.log(
        '%c📍 Av. Candido Portinari, 119 - Vila Jaguara, São Paulo/SP',
        'color: #003d7a; font-size: 13px;'
    );
    console.log(
        '%c📞 (11) 3621-4451 | (11) 3605-9774',
        'color: #ff6b00; font-size: 13px; font-weight: bold;'
    );
});
