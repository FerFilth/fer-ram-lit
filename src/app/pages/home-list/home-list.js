import { LitElement, html, css } from "lit";
import { shadowReset } from "../../styles/shadow-reset.js";
import "../../components/ram-input/ram-input.js";
import "../../components/ram-grid/ram-grid.js";
import "../../components/paginator/paginator.js";
import "../../components/ram-modal/ram-modal.js";
import { ramStore } from "../../services/ram.service.js";
import { iconFonts } from "../../styles/icon-fonts.js";
import { homeListStyles } from "./home-list.css.js";

/**
 * @typedef {Object} RamCharacter
 * @property {number} id
 * @property {string} name
 * @property {string} image
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
    /** @type {'light'|'dark'} */
    currentTheme: { state: true },
  };

  static styles = [shadowReset, iconFonts, homeListStyles];

  constructor() {
    super();
    this.characters = [];
    this.isLoading = false;
    this.showOnlyFavorites = false;
    this.modalCharacter = null;
    this.isModalOpen = false;
    this.currentTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    this.unsubscribe = null;
    this.onSearch = this.onSearch.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.onFavoriteChanged = this.onFavoriteChanged.bind(this);
    this.onOpenCharacterModal = this.onOpenCharacterModal.bind(this);
    this.onCloseCharacterModal = this.onCloseCharacterModal.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.onThemeAttributeMutation = this.onThemeAttributeMutation.bind(this);
    this.themeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.syncThemeFromDocument();

    this.themeObserver = new MutationObserver(this.onThemeAttributeMutation);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    this.unsubscribe = ramStore.subscribe((state) => {
      this.isLoading = state.loading;
      this.showOnlyFavorites = state.favoriteMode;
      this.characters = state.characters;
    });

    ramStore.triggerUpdate();
  }

  disconnectedCallback() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
    }

    this.themeObserver?.disconnect();
    this.themeObserver = null;

    super.disconnectedCallback();
  }

  onThemeAttributeMutation() {
    this.syncThemeFromDocument();
  }

  syncThemeFromDocument() {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    this.currentTheme = theme;
    this.setAttribute("theme", theme);
  }

  /**
   * @param {CustomEvent<string>} event
   */
  onSearch(event) {
    ramStore.setSearch(event.detail ?? "");
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

  toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";

    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      this.syncThemeFromDocument();
      return;
    }

    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    this.syncThemeFromDocument();
  }

  render() {
    const title = this.showOnlyFavorites
      ? "Mis favoritos"
      : "Wubba lubba dub dub!";
    const favoriteLabel = this.showOnlyFavorites ? "" : "Mis favoritos";
    const favoriteIcon = this.showOnlyFavorites ? "home" : "star";
    const themeIcon = this.currentTheme === "dark" ? "light_mode" : "dark_mode";
    const themeAriaLabel =
      this.currentTheme === "dark"
        ? "Cambiar a tema claro"
        : "Cambiar a tema oscuro";

    return html`
      <main class="home-container grid-home-page">
        <section class="section-row">
          <div class="full-col">
            <div class="header-actions">
              <button
                class="theme-toggle-btn"
                type="button"
                @click=${this.toggleTheme}
                aria-label=${themeAriaLabel}
                title=${themeAriaLabel}
              >
                <span class="material-symbols-outlined theme-toggle-icon"
                  >${themeIcon}</span
                >
              </button>
            </div>
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
                  ? "favorite-button favorite-active is-active"
                  : "favorite-button favorite-inactive"}
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
              © 2026 Fernando Gonzalez Zamora. Proyecto desarrollado con Lit.
            </p>
            <p>Datos proporcionados por la API de Rick and Morty.</p>
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

customElements.define("home-list", HomeListPage);
