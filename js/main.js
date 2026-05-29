document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION & LANGUAGE SWITCHER ---
    const translations = {
        en: { nav_home: "Home", nav_technology: "The Technology", nav_approach: "Our Approach", nav_services: "Services", nav_schedule: "Schedule", nav_contact: "Contact", hero_title: "Experience<br>The Impulse.<br>Transform In<br><strong>20 Minutes.</strong>", cta_instagram: "Book on Instagram", cta_whatsapp: "Contact on WhatsApp", tech_title: "The Technology of EMS", tech_p: "Electro Muscle Stimulation (EMS) is a revolutionary full-body workout that uses safe, low-frequency electrical impulses to stimulate up to 90% of your muscles simultaneously. This method provides a high-intensity workout in just 20 minutes, making it an incredibly efficient and effective way to achieve your fitness goals.", benefit_card_1_h4: "Time-Efficient", benefit_card_1_p: "Get the results of a 3-hour conventional workout in just 20 minutes.", benefit_card_2_h4: "Builds Strength", benefit_card_2_p: "Activates deep muscle fibers to increase strength and muscle mass effectively.", benefit_card_3_h4: "Gentle on Joints", benefit_card_3_p: "No weights, no high-impact movements. The perfect workout without stressing your joints.", benefit_card_4_h4: "Aids Weight Loss", benefit_card_4_p: "Boosts your metabolism during and after the workout, helping to burn fat.", benefit_card_5_h4: "Reduces Pain", benefit_card_5_p: "Improves posture and can help alleviate back pain by strengthening core muscles.", benefit_card_6_h4: "Improves Performance", benefit_card_6_p: "Enhances speed, power, and endurance for athletes and fitness enthusiasts.", approach_title: "Our Approach", feature_1_h3: "Maximize Performance", feature_1_p: "Activate up to 90% of your muscle fibers simultaneously, reaching deep motor tissues traditional workouts miss completely.", feature_2_h3: "Save Time", feature_2_p: "A highly focused 20-minute session delivers metabolic stress equivalent to over 3 hours of standard high-impact gym training.", feature_3_h3: "Targeted Stimulation", feature_3_p: "Independently scale localized low-frequency pulse levels to target custom trouble-zones or rehabilitation paths safely.", services_title: "Our services", services_p: "New services are being developed. Check back soon for updates!", schedule_title: "Schedule", schedule_p: "Our full schedule will be available shortly. Contact us to book your session!", contact_title: "Get In Touch", contact_instagram_h4: "Instagram", contact_whatsapp_h4: "WhatsApp", contact_phone_h4: "Phone", contact_whatsapp_a: "Chat with us", },
        pt: { nav_home: "Início", nav_technology: "A Tecnologia", nav_approach: "Nossa Abordagem", nav_services: "Serviços", nav_schedule: "Horários", nav_contact: "Contato", hero_title: "Sinta<br>O Impulso.<br>Transforme-se em<br><strong>20 Minutos.</strong>", cta_instagram: "Agende no Instagram", cta_whatsapp: "Contato no WhatsApp", tech_title: "A Tecnologia de EMS", tech_p: "A Eletroestimulação Muscular (EMS) é um treino revolucionário de corpo inteiro que usa impulsos elétricos seguros e de baixa frequência para estimular até 90% dos seus músculos simultaneamente. Este método proporciona um treino de alta intensidade em apenas 20 minutes, tornando-o uma forma incrivelmente eficiente e eficaz de atingir os seus objetivos de fitness.", benefit_card_1_h4: "Eficiente em Tempo", benefit_card_1_p: "Obtenha os resultados de um treino convencional de 3 horas em apenas 20 minutos.", benefit_card_2_h4: "Aumenta a Força", benefit_card_2_p: "Ativa fibras musculares profundas para aumentar a força e a massa muscular de forma eficaz.", benefit_card_3_h4: "Suave nas Articulações", benefit_card_3_p: "Sem pesos, sem movimentos de alto impacto. O treino perfeito sem sobrecarregar as suas articulações.", benefit_card_4_h4: "Ajuda na Perda de Peso", benefit_card_4_p: "Acelera o seu metabolismo durante e após o treino, ajudando a queimar gordura.", benefit_card_5_h4: "Reduz a Dor", benefit_card_5_p: "Melhora a postura e pode ajudar a aliviar dores nas costas, fortalecendo os músculos do core.", benefit_card_6_h4: "Melhora o Desempenho", benefit_card_6_p: "Aumenta a velocidade, potência e resistência para atletas e entusiastas do fitness.", approach_title: "Nossa Abordagem", feature_1_h3: "Maximizar Desempenho", feature_1_p: "Ative até 90% das suas fibras musculares simultaneamente, alcançando tecidos motores profundos que os treinos tradicionais não conseguem.", feature_2_h3: "Economize Tempo", feature_2_p: "Uma sessão focada de 20 minutos proporciona um estresse metabólico equivalente a mais de 3 horas de treino padrão em academia.", feature_3_h3: "Estimulação Direcionada", feature_3_p: "Ajuste independentemente os níveis de pulso de baixa frequência para visar zonas problemáticas ou caminhos de reabilitação com segurança.", services_title: "Nossos Serviços", services_p: "Novos serviços estão a ser desenvolvidos. Volte em breve para novidades!", schedule_title: "Horários", schedule_p: "Nosso calendário completo estará disponível em breve. Contate-nos para agendar sua sessão!", contact_title: "Entre em Contato", contact_instagram_h4: "Instagram", contact_whatsapp_h4: "WhatsApp", contact_phone_h4: "Telefone", contact_whatsapp_a: "Fale conosco", },
        uk: { nav_home: "Головна", nav_technology: "Технологія", nav_approach: "Наш підхід", nav_services: "Послуги", nav_schedule: "Розклад", nav_contact: "Контакти", hero_title: "Відчуйте<br>Імпульс.<br>Трансформація за<br><strong>20 Хвилин.</strong>", cta_instagram: "Записатись в Instagram", cta_whatsapp: "Зв'язатись у WhatsApp", tech_title: "Технологія EMS", tech_p: "Електроміостимуляція (EMS) — це революційне тренування для всього тіла, яке використовує безпечні низькочастотні електричні імпульси для одночасної стимуляції до 90% ваших м'язів. Цей метод забезпечує високоінтенсивне тренування всього за 20 хвилин, що робить його неймовірно ефективним способом досягнення ваших фітнес-цілей.", benefit_card_1_h4: "Економія часу", benefit_card_1_p: "Отримайте результати 3-годинного звичайного тренування всього за 20 хвилин.", benefit_card_2_h4: "Нарощування сили", benefit_card_2_p: "Активує глибокі м'язові волокна для ефективного збільшення сили та м'язової маси.", benefit_card_3_h4: "Береже суглоби", benefit_card_3_p: "Без ваги, без ударних навантажень. Ідеальне тренування без навантаження на суглоби.", benefit_card_4_h4: "Сприяє схудненню", benefit_card_4_p: "Прискорює метаболізм під час і після тренування, допомагаючи спалювати жир.", benefit_card_5_h4: "Зменшує біль", benefit_card_5_p: "Покращує поставу та може допомогти полегшити біль у спині, зміцнюючи м'язи кора.", benefit_card_6_h4: "Покращує продуктивність", benefit_card_6_p: "Підвищує швидкість, силу та витривалість для спортсменів та любителів фітнесу.", approach_title: "Наш підхід", feature_1_h3: "Максимізація продуктивності", feature_1_p: "Активуйте до 90% м'язових волокон одночасно, досягаючи глибоких рухових тканин, які традиційні тренування пропускають.", feature_2_h3: "Економія часу", feature_2_p: "Висококонцентрована 20-хвилинна сесія забезпечує метаболічний стрес, еквівалентний понад 3 годинам стандартного тренування в залі.", feature_3_h3: "Цільова стимуляція", feature_3_p: "Незалежно регулюйте рівні низькочастотних імпульсів для безпечного впливу на проблемні зони або реабілітаційні шляхи.", services_title: "Наші послуги", services_p: "Розробляються нові послуги. Заходьте пізніше за оновленнями!", schedule_title: "Розклад", schedule_p: "Наш повний розклад буде доступний незабаром. Зв'яжіться з нами, щоб забронкувати сесію!", contact_title: "Зв'яжіться з нами", contact_instagram_h4: "Instagram", contact_whatsapp_h4: "WhatsApp", contact_phone_h4: "Телефон", contact_whatsapp_a: "Написати нам", },
        ru: { nav_home: "Главная", nav_technology: "Технология", nav_approach: "Наш подход", nav_services: "Услуги", nav_schedule: "Расписание", nav_contact: "Контакты", hero_title: "Почувствуй<br>Импульс.<br>Трансформация за<br><strong>20 Минут.</strong>", cta_instagram: "Записаться в Instagram", cta_whatsapp: "Связаться в WhatsApp", tech_title: "Технология EMS", tech_p: "Электромиостимуляция (EMS) — это революционная тренировка для всего тела, использующая безопасные низкочастотные электрические импульсы для одновременной стимуляции до 90% ваших мышц. Этот метод обеспечивает высокоинтенсивную тренировку всего за 20 минут, что делает его невероятно эффективным способом достижения ваших фитнес-целей.", benefit_card_1_h4: "Экономия времени", benefit_card_1_p: "Получите результаты 3-часовой обычной тренировки всего за 20 минут.", benefit_card_2_h4: "Наращивание силы", benefit_card_2_p: "Активирует глубокие мышечные волокна для эффективного увеличения силы и мышечной массы.", benefit_card_3_h4: "Бережное отношение к суставам", benefit_card_3_p: "Без веса, без ударных нагрузок. Идеальная тренировка без нагрузки на суставы.", benefit_card_4_h4: "Способствует похудению", benefit_card_4_p: "Ускоряет метаболизм во время и после тренировки, помогая сжигать жир.", benefit_card_5_h4: "Уменьшает боль", benefit_card_5_p: "Улучшает осанку и может помочь облегчить боль в спине, укрепляя мышцы кора.", benefit_card_6_h4: "Улучшает производительность", benefit_card_6_p: "Повышает скорость, силу и выносливость для спортсменов и любителей фитнеса.", approach_title: "Наш подход", feature_1_h3: "Максимизация производительности", feature_1_p: "Активируйте до 90% мышечных волокон одновременно, достигая глубоких двигательных тканей, которые традиционные тренировки упускают.", feature_2_h3: "Экономия времени", feature_2_p: "Высококонцентрированная 20-минутная сессия обеспечивает метаболический стресс, эквивалентный более чем 3 часам стандартной тренировки в зале.", feature_3_h3: "Целевая стимуляция", feature_3_p: "Независимо регулируйте уровни низкочастотных импульсов для безопасного воздействия на проблемные зоны или реабилитационные пути.", services_title: "Наши услуги", services_p: "Разрабатываются новые услуги. Загляните позже за обновлениями!", schedule_title: "Расписание", schedule_p: "Наше полное расписание будет доступно в ближайшее время. Свяжитесь с нами, чтобы забронировать сессию!", contact_title: "Свяжитесь с нами", contact_instagram_h4: "Instagram", contact_whatsapp_h4: "WhatsApp", contact_phone_h4: "Телефон", contact_whatsapp_a: "Написать нам", },
        nl: { nav_home: "Home", nav_technology: "De Technologie", nav_approach: "Onze Aanpak", nav_services: "Diensten", nav_schedule: "Schema", nav_contact: "Contact", hero_title: "Ervaar<br>De Impuls.<br>Transformeer in<br><strong>20 Minuten.</strong>", cta_instagram: "Boek op Instagram", cta_whatsapp: "Contact op WhatsApp", tech_title: "De Technologie van EMS", tech_p: "Elektro Musculaire Stimulatie (EMS) is een revolutionaire full-body workout die veilige, laagfrequente elektrische impulsen gebruikt om tot 90% van je spieren tegelijk te stimuleren. Deze methode biedt een training met hoge intensiteit in slechts 20 minuten, waardoor het een ongelooflijk efficiënte en effectieve manier is om je fitnessdoelen te bereiken.", benefit_card_1_h4: "Tijdbesparend", benefit_card_1_p: "Behaal de resultaten van een conventionele training van 3 uur in slechts 20 minuten.", benefit_card_2_h4: "Bouwt Kracht Op", benefit_card_2_p: "Activeert diepe spiervezels om kracht en spiermassa effectief te vergroten.", benefit_card_3_h4: "Zacht voor Gewrichten", benefit_card_3_p: "Geen gewichten, geen high-impact bewegingen. De perfecte training zonder je gewrichten te belasten.", benefit_card_4_h4: "Helpt bij Gewichtsverlies", benefit_card_4_p: "Verhoogt je metabolisme tijdens en na de training, wat helpt bij het verbranden van vet.", benefit_card_5_h4: "Vermindert Pijn", benefit_card_5_p: "Verbetert de houding en kan rugpijn helpen verlichten door de kernspieren te versterken.", benefit_card_6_h4: "Verbetert Prestaties", benefit_card_6_p: "Verbetert snelheid, kracht en uithoudingsvermogen voor atleten en fitnessliefhebbers.", approach_title: "Onze Aanpak", feature_1_h3: "Maximaliseer Prestaties", feature_1_p: "Activeer tot 90% van je spiervezels tegelijk, en bereik diepe motorische weefsels die traditionele trainingen volledig missen.", feature_2_h3: "Bespaar Tijd", feature_2_p: "Een zeer gerichte sessie van 20 minuten levert metabole stress op die gelijk is aan meer dan 3 uur standaard sportschooltraining.", feature_3_h3: "Gerichte Stimulatie", feature_3_p: "Schaal onafhankelijk gelokaliseerde laagfrequente pulsniveaus om veilig aangepaste probleemzones of revalidatiepaden aan te pakken.", services_title: "Onze Diensten", services_p: "Nieuwe diensten worden ontwikkeld. Kom snel terug voor updates!", schedule_title: "Schema", schedule_p: "Ons volledige schema is binnenkort beschikbaar. Neem contact met ons op om uw sessie te boeken!", contact_title: "Neem Contact Op", contact_instagram_h4: "Instagram", contact_whatsapp_h4: "WhatsApp", contact_phone_h4: "Telefoon", contact_whatsapp_a: "Chat met ons", }
    };

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const supportedLangs = ['en', 'pt', 'uk', 'ru', 'nl'];

    langBtn.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('show'); });
    document.addEventListener('click', (e) => { if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) { langDropdown.classList.remove('show'); } });

    langDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        if (lang) {
            setLanguage(lang);
            langDropdown.classList.remove('show');
        }
    });

    function getInitialLang() {
        const savedLang = getCookie('lang');
        if (savedLang && supportedLangs.includes(savedLang)) { return savedLang; }
        const browserLang = navigator.language.split('-')[0];
        if (supportedLangs.includes(browserLang)) { return browserLang; }
        return 'en';
    }

    function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) return;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) { el.innerHTML = translations[lang][key]; }
        });
        langBtn.textContent = lang;
        document.querySelectorAll('.lang-switcher-dropdown a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('data-lang') === lang) { a.classList.add('active'); }
        });
        setCookie('lang', lang, 30);
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    setLanguage(getInitialLang());

    // --- INTERACTIVE APPARATUS EXPLORER CONTROLLER ---
    const nodes = document.querySelectorAll('.pulse-node');
    const items = document.querySelectorAll('.feature-item');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            nodes.forEach(n => n.classList.remove('active'));
            items.forEach(i => i.classList.remove('active'));
            node.classList.add('active');
            const targetId = node.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- SCROLL WATCHER LOGIC FOR NAV HIGHLIGHTS ---
    const sections = document.querySelectorAll('section');
    const navA = document.querySelectorAll('nav ul li a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navA.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });
});