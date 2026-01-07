const CONFIG = {
  socials: [
    { name: 'GitHub', url: 'https://github.com/aleqsanbr', icon: './icons/github.svg' },
    { name: 'Telegram', url: 'https://t.me/aleqsanbr', icon: './icons/telegram.svg' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aleqsanbr', icon: './icons/linkedin.svg' }
  ],

  yoomoney: {
    url: 'https://yoomoney.ru/to/4100118478520818'
  },

  cryptos: [
    { name: 'Bitcoin', address: 'bc1qygadnu4vj4qcuyr86023qsfd5lrnelq7wxfhw5', logo: './icons/btc.svg' },
    { name: 'Ethereum', address: '0xA2Da1EF47934D3d93C7A76b7C12956e6e77e85A0', logo: './icons/eth.svg' },
    { name: 'Toncoin', address: 'UQARnvwycrkeZrukJkgoq_k5Lvs-nq2XxbHNU7w7GsldLWN2', logo: './icons/ton.svg' },
    { name: 'USDT (TRC20)', address: 'TBt5tt5XHh7QprkwQf2EfDn6B8n91PW93Q', logo: './icons/usdt.svg' }
  ],

  projects: [
    {
      nameKey: 'projects.yandex_music_export.name',
      descriptionKey: 'projects.yandex_music_export.description',
      image: 'https://u-pov.ru/wp-content/uploads/2023/07/UserPOV-1024x724.png',
      url: 'https://yme.u-pov.ru'
    },
    {
      nameKey: 'projects.more_to_come.name',
      descriptionKey: 'projects.more_to_come.description',
      image: './project_pics/default.png',
      url: 'https://github.com/aleqsanbr'
    },
  ]
};

function renderSocials() {
  const container = document.getElementById('socialLinks');
  container.innerHTML = CONFIG.socials
    .map(
      (social) =>
        `<a href="${social.url}" target="_blank" class="social-icon" aria-label="${social.name}">
            <img src="${social.icon}" alt="${social.name}" width="20" height="20">
        </a>`
    )
    .join('');
}

function renderCryptos() {
  const container = document.getElementById('cryptoGrid');
  container.innerHTML = CONFIG.cryptos
    .map(
      (crypto) => `
        <div class="crypto-card">
            <div class="crypto-header">
                <img src="${crypto.logo}" alt="${crypto.name}" class="crypto-logo">
                <div class="crypto-name">${crypto.name}</div>
            </div>
            <div class="crypto-address" data-address="${crypto.address}" data-logo="${crypto.logo}" data-name="${crypto.name}">
                <span class="address-text">${crypto.address}</span>
                <button class="copy-btn" title="{{crypto.copy_button_title}}">
                    <img src="./icons/copy.svg" alt="Copy" width="16" height="16">
                </button>
                <button class="qr-btn" title="{{crypto.qr_button_title}}">
                    <img src="./icons/qr.svg" alt="QR" width="16" height="16">
                </button>
            </div>
        </div>
    `
    )
    .join('');
}

function renderProjects() {
  const container = document.getElementById('projectGrid');
  container.innerHTML = CONFIG.projects
    .map(
      (project) => `
        <a href="${project.url}" target="_blank" class="project-card">
            <div class="project-image" style="background-image: url('${project.image}')"></div>
            <div class="project-content">
                <div class="project-name">{{${project.nameKey}}}</div>
                <div class="project-desc">{{${project.descriptionKey}}}</div>
            </div>
        </a>
    `
    )
    .join('');
}

function copyAddress(button) {
  const card = button.closest('.crypto-address');
  const address = card.dataset.address;
  navigator.clipboard.writeText(address).then(() => showToast());
}

function showToast() {
  const toast = document.getElementById('copyToast');
  toast.textContent = i18n.t('crypto.copy_toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function showQR(button) {
  const card = button.closest('.crypto-address');
  const { address, logo, name } = card.dataset;

  const modal = document.getElementById('qrModal');
  const qrContainer = document.getElementById('qrCode');

  qrContainer.innerHTML = '';

  const qrSize = Math.min(window.innerWidth * 0.7, 300);

  new QRCode(qrContainer, { text: address, width: qrSize, height: qrSize, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });

  document.getElementById('qrLogo').src = logo;
  document.getElementById('qrName').textContent = name;
  document.getElementById('qrAddress').textContent = address;

  modal.classList.add('show');
}

function closeQR() {
  document.getElementById('qrModal').classList.remove('show');
}

function updateCurrentLangDisplay() {
  const langNames = {
    ru: 'RU',
    en: 'EN'
  };
  document.getElementById('currentLang').textContent = langNames[i18n.getCurrentLanguage()];
}

function initLanguageSelector() {
  const langButton = document.getElementById('langButton');
  const langDropdown = document.getElementById('langDropdown');

  langButton.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    langDropdown.classList.remove('show');
  });

  langDropdown.addEventListener('click', (e) => {
    if (e.target.dataset.lang) {
      i18n.setLanguage(e.target.dataset.lang);
      updateCurrentLangDisplay();
    }
  });
}

function initEventListeners() {
  document.getElementById('yoomoneyBtn').addEventListener('click', () => {
    window.open(CONFIG.yoomoney.url, '_blank');
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.copy-btn')) copyAddress(e.target.closest('.copy-btn'));
    if (e.target.closest('.qr-btn')) showQR(e.target.closest('.qr-btn'));
  });

  document.getElementById('qrModal').addEventListener('click', closeQR);
  document.querySelector('.qr-content').addEventListener('click', (e) => e.stopPropagation());
  document.querySelector('.qr-close').addEventListener('click', closeQR);

  initLanguageSelector();
}

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.loadTranslations();
  renderSocials();
  renderCryptos();
  renderProjects();
  i18n.translatePage();
  updateCurrentLangDisplay();
  initEventListeners();

  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.querySelector('.container').style.opacity = '1';
  }, 100);
});
