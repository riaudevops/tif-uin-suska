/** Agenda page: category filtering and the event detail modal. */
function initAgenda() {
  const dataRoot = document.getElementById('agenda-data');
  if (!dataRoot || dataRoot.dataset.agendaReady === '1') return;
  dataRoot.dataset.agendaReady = '1';

    let agendaData = [];
    let modalI18n = {};
    try {
      agendaData = JSON.parse(dataRoot?.dataset.agenda || '[]');
      modalI18n = JSON.parse(dataRoot?.dataset.i18n || '{}');
    } catch {
      agendaData = [];
      modalI18n = {};
    }

    const cards = document.querySelectorAll('.agenda-card');
    const modal = document.getElementById('agenda-modal');
    const closeModalElements = document.querySelectorAll('.close-modal');

    const mKategori = document.getElementById('modal-kategori');
    const mJudul = document.getElementById('modal-judul');
    const mDeskripsi = document.getElementById('modal-deskripsi');
    const mTanggal = document.getElementById('modal-tanggal');
    const mWaktu = document.getElementById('modal-waktu');
    const mLokasi = document.getElementById('modal-lokasi');
    const mActionArea = document.getElementById('modal-action-area');

    const getClientKategoriClass = (kat) => {
      if (!kat) return 'bg-slate-100 text-slate-700 border-slate-200';
      const hash = kat.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const colors = [
        'bg-red-100 text-red-700 border-red-200',
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-purple-100 text-purple-700 border-purple-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-indigo-100 text-indigo-700 border-indigo-200',
        'bg-pink-100 text-pink-700 border-pink-200',
        'bg-teal-100 text-teal-700 border-teal-200',
        'bg-green-100 text-green-700 border-green-200',
      ];
      return colors[hash % colors.length];
    };

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset all buttons to inactive state
        filterBtns.forEach(b => {
          b.classList.remove('bg-[#004d2c]', 'text-white', 'border-[#004d2c]');
          b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
        });

        // Set active state for clicked button
        btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
        btn.classList.add('bg-[#004d2c]', 'text-white', 'border-[#004d2c]');

        const filterValue = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const kat = card.getAttribute('data-kategori');
          if (filterValue === 'All' || kat === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    const openModal = (index) => {
      const data = agendaData[index];
      if (!data) return;

      mKategori.className = `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getClientKategoriClass(data.kategori)}`;
      mKategori.textContent = data.kategori;

      mJudul.textContent = data.judul;
      mDeskripsi.textContent = data.deskripsi;
      mTanggal.textContent = `${data.tanggal} ${data.bulan} ${data.tahun}`;
      mWaktu.textContent = data.waktu;
      mLokasi.textContent = data.lokasi;

      mActionArea.replaceChildren();
      if (data.linkPendaftaran) {
        let registrationUrl;
        try {
          registrationUrl = new URL(data.linkPendaftaran, window.location.origin);
        } catch {
          console.error("Agenda registration link is not a valid URL.");
        }

        if (registrationUrl && ['http:', 'https:'].includes(registrationUrl.protocol)) {
          const registerLink = document.createElement('a');
          registerLink.href = registrationUrl.href;
          registerLink.target = '_blank';
          registerLink.rel = 'noopener noreferrer';
          registerLink.className = 'w-full block text-center py-3 px-4 bg-[#004d2c] hover:bg-[#00361f] text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-900/20 focus:ring-4 focus:ring-green-300';
          registerLink.textContent = modalI18n.register;
          mActionArea.appendChild(registerLink);
        } else {
          console.error("Agenda registration link must use HTTP or HTTPS.");
          const invalidMessage = document.createElement('div');
          invalidMessage.className = 'text-center p-3 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200';
          invalidMessage.textContent = modalI18n.invalidReg;
          mActionArea.appendChild(invalidMessage);
        }
      } else {
        const noRegistrationMessage = document.createElement('div');
        noRegistrationMessage.className = 'text-center p-3 bg-slate-50 text-slate-400 rounded-xl text-sm border border-slate-100 border-dashed';
        noRegistrationMessage.textContent = modalI18n.noReg;
        mActionArea.appendChild(noRegistrationMessage);
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    };

    cards.forEach(card => {
      card.addEventListener('click', () => {
        openModal(card.getAttribute('data-index'));
      });
    });

    closeModalElements.forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Auto-open modal if 'id' parameter is present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id');
    if (targetId) {
      const targetIdx = agendaData.findIndex(item => String(item.id) === String(targetId));
      if (targetIdx !== -1) {
        openModal(targetIdx);
      }
    }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAgenda, { once: true });
} else {
  initAgenda();
}
document.addEventListener('astro:page-load', initAgenda);
