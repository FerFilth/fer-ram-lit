import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
import '../../components/ram-input/ram-input.js';
import '../../components/ram-grid/ram-grid.js';
import '../../components/paginator/paginator.js';
import '../../components/ram-modal/ram-modal.js';
import { ramStore } from '../../services/ram.service.js';
import { iconFonts } from '../../styles/icon-fonts.js';

/**
 * @typedef {Object} RamCharacter
 * @property {number} id
 * @property {string} name
 * @property {string} image
 */

/**
 * Main list page for browsing Rick and Morty characters.
 */
export class HomeListPage extends LitElement {
  static properties = {
    /** @type {RamCharacter[]} */
    characters: { state: true },
    /** @type {boolean} */
    isLoading: { state: true },
    /** @type {boolean} */
    showOnlyFavorites: { state: true },
    /** @type {RamCharacter | null} */
    modalCharacter: { state: true },
    /** @type {boolean} */
    isModalOpen: { state: true },
  };

  static styles = [
    shadowReset,
    iconFonts,
    css`
      :host {
        display: block;
        background: var(--bg-color);
        color: var(--text-color);
        width: 100%;
        min-height: 100%;
        height: 100%;
      }

      .home-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }

      .grid-home-page {
        background-color: var(--bg-color);
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 1rem;
        padding: 18px 18px 9px 18px;
        height: 100%;
        overflow: hidden;
      }

      .grid-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto auto;
        gap: 8px;
        overflow: hidden;
        min-height: 0;
      }

      .grid-content .action-bar {
        display: flex;
        min-height: 45px;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .grid-scroll-container {
        overflow-y: auto;
        min-height: 0;
        border-radius: 10px;
        padding-right: 4px;
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }

      .grid-scroll-container::-webkit-scrollbar {
        width: 8px; /* Scrollbar más delgado */
      }

      .grid-scroll-container::-webkit-scrollbar-track {
        background: transparent; /* Pista invisible */
        border-radius: 4px;
      }

      .grid-scroll-container::-webkit-scrollbar-thumb {
        background-color: var(
          --border-color
        ); /* Color sutil adaptado al tema */
        border-radius: 4px;
      }

      .grid-scroll-container::-webkit-scrollbar-thumb:hover {
        background-color: var(
          --primary-color
        ); /* Feedback visual al hacer hover */
      }

      .section-row,
      .full-col {
        width: 100%;
      }

      .center-text {
        text-align: center;
      }

      .mb-0 {
        margin-bottom: 0;
      }

      .mb-2 {
        margin-bottom: 0.5rem;
      }

      .mb-3 {
        margin-bottom: 1rem;
      }

      .mt-4 {
        margin-top: 1.5rem;
      }

      .block {
        display: block;
      }

      .favorites-toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.25rem;
      }

      .info-alert {
        padding: 1rem;
        border-radius: 8px;
        background: #e7f1ff;
        color: #084298;
        text-align: center;
      }

      .icon-xl {
        font-size: 2.5rem;
      }

      .favorite-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        border: none;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
      }

      .favorite-button .favorite-icon {
        cursor: pointer;
        user-select: none;
        color: #6c757d;
        font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
        transition: all 0.2s ease;
      }

      .favorite-button.is-active .favorite-icon {
        font-variation-settings:
          'FILL' 1,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
      }

      .favorite-button.is-active:hover {
        background-color: var(--btn-primary-bg);
        transform: scale(1.05);
      }

      .favorite-button.is-active:hover .favorite-icon {
        color: #e9d9a9;
      }

      .favorite-button:not(.is-active):hover {
        background-color: #e9ecef;
        transform: scale(1.05);
      }

      .favorite-button:not(.is-active):hover .favorite-icon {
        color: #ffc107;
        font-variation-settings:
          'FILL' 1,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
      }

      .favorite-button.favorite-active {
        background-color: var(--btn-primary-bg);
      }

      .favorite-button.favorite-active .favorite-icon {
        color: #fff;
      }

      .favorite-button.favorite-inactive {
        background-color: #f8f9fa;
      }

      .favorite-button.favorite-inactive .favorite-icon {
        color: #6c757d;
      }

      .favorite-button-label {
        font-weight: 600;
      }

      .grid-slot {
        width: 100%;
      }

      .empty-favorites-icon {
        font-variation-settings: 'FILL' 0;
      }

      .micro-footer {
        text-align: center;
        padding-top: 6px;
        font-size: 0.85rem;
        color: var(--text-color);
        opacity: 0.7;
      }

      .micro-footer a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: bold;
      }

      .micro-footer a:hover {
        text-decoration: underline;
      }

      @media (max-width: 720px) {
        .grid-content .action-bar {
          flex-direction: column;
          align-items: stretch;
        }

        .favorites-toolbar {
          justify-content: space-between;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.characters = [];
    this.isLoading = false;
    this.showOnlyFavorites = false;
    this.modalCharacter = null;
    this.isModalOpen = false;
    this.unsubscribe = null;
    this.onSearch = this.onSearch.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.onFavoriteChanged = this.onFavoriteChanged.bind(this);
    this.onOpenCharacterModal = this.onOpenCharacterModal.bind(this);
    this.onCloseCharacterModal = this.onCloseCharacterModal.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = ramStore.subscribe((state) => {
      this.isLoading = state.loading;
      this.showOnlyFavorites = state.favoriteMode;
      this.characters = state.characters;
    });

    ramStore.triggerUpdate();
  }

  disconnectedCallback() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
    super.disconnectedCallback();
  }

  /**
   * @param {CustomEvent<string>} event
   */
  onSearch(event) {
    ramStore.setSearch(event.detail ?? '');
  }

  toggleFavorite() {
    ramStore.setFavoriteMode(!this.showOnlyFavorites);
  }

  onFavoriteChanged() {
    if (!this.showOnlyFavorites) return;

    ramStore.triggerUpdate();
  }

  /**
   * @param {CustomEvent<{character: RamCharacter}>} event
   */
  onOpenCharacterModal(event) {
    const nextCharacter = event.detail?.character ?? null;
    if (!nextCharacter) return;

    this.modalCharacter = nextCharacter;
    this.isModalOpen = true;
  }

  onCloseCharacterModal() {
    this.isModalOpen = false;
  }

  render() {
    const title = this.showOnlyFavorites
      ? 'Mis favoritos'
      : 'Wubba lubba dub dub!';
    const favoriteLabel = this.showOnlyFavorites ? '' : 'Mis favoritos';
    const favoriteIcon = this.showOnlyFavorites ? 'home' : 'star';

    return html`
      <main class="home-container grid-home-page">
        <section class="section-row">
          <div class="full-col">
            <h1 class="center-text mb-3">${title}</h1>
            <p class="mb-3 center-text">
              Base de datos de personajes de Rick y Morty
            </p>
          </div>
        </section>

        <div class="grid-content">
          <div class="action-bar">
            <ram-input
              .isLoading=${this.isLoading}
              @item=${this.onSearch}
            ></ram-input>
            <div class="favorites-toolbar">
              <span class="favorite-button-label">${favoriteLabel}</span>
              <button
                class=${this.showOnlyFavorites
                  ? 'favorite-button favorite-active is-active'
                  : 'favorite-button favorite-inactive'}
                @click=${this.toggleFavorite}
              >
                <span class="material-symbols-outlined favorite-icon">
                  ${favoriteIcon}
                </span>
              </button>
            </div>
          </div>

          <div class="grid-scroll-container">
            <div
              class="grid-slot"
              @favorite-change=${this.onFavoriteChanged}
              @open-character-modal=${this.onOpenCharacterModal}
            >
              ${this.showOnlyFavorites && this.characters.length === 0
                ? html`
                    <div class="info-alert mt-4">
                      <span
                        class="material-symbols-outlined icon-xl block mb-2 empty-favorites-icon"
                        >star</span
                      >
                      <p class="mb-0">
                        No tienes personajes favoritos aún. ¡Empieza a marcar
                        tus favoritos!
                      </p>
                    </div>
                  `
                : null}
              <ram-grid .characters=${this.characters}></ram-grid>
            </div>
          </div>

          <app-paginator .isLoading=${this.isLoading}></app-paginator>
          <footer class="micro-footer">
            <p>
              © 2026 Fernando Gonzalez Zamora. Proyecto desarrollado con
              Lit.
            </p>
            <p>Datos proporcionados por la Rick and Morty API.</p>
          </footer>
        </div>

        <ram-modal
          .open=${this.isModalOpen}
          .character=${this.modalCharacter}
          @close-modal=${this.onCloseCharacterModal}
        ></ram-modal>
      </main>
    `;
  }
}

customElements.define('home-list', HomeListPage);
