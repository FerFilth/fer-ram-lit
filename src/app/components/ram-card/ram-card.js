import { LitElement, html, css } from 'lit';
import { when } from 'lit/directives/when.js';
import { shadowReset } from '../../styles/shadow-reset.js';
import { ramStore } from '../../services/ram.service.js';
import { iconFonts } from '../../styles/icon-fonts.js';

const spinnerIcon = '/src/assets/svg/loader.svg';

/**
 * @typedef {Object} RamCharacter
 * @property {number} id - Character id.
 * @property {string} name - Character name.
 * @property {string} image - Character avatar URL.
 */

/**
 * Card UI for a single Rick and Morty character.
 */
export class RamCard extends LitElement {
  static styles = [
    shadowReset,
    iconFonts,
    css`
      :host {
        display: block;
        height: 100%;
      }

      .ram-card-root {
        height: 100%;
        border: 1px solid var(--border-color, #d7dce3);
        border-radius: 0.75rem;
        background: var(--surface-color, #ffffff);
        box-shadow: 0 4px 14px rgba(10, 26, 47, 0.08);
        overflow: hidden;
      }

      .ram-card-body {
        height: 100%;
        padding: 0.65rem;
        display: grid;
        gap: 0.6rem;
      }

      .ram-card-image-box {
        position: relative;
        width: 100%;
        padding-top: 100%;
        border-radius: 0.55rem;
        overflow: hidden;
        background: radial-gradient(
          circle at 20% 20%,
          #f4f6f9 0%,
          #eceff4 45%,
          #e5e9ef 100%
        );
      }

      .ram-card-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }

      .ram-card-loader {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }

      .ram-card-spinner {
        width: 34px;
        height: 34px;
        animation: ram-card-spin 0.8s linear infinite;
      }

      .ram-card-spinner-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .ram-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }

      .ram-card-title {
        margin: 0;
        font-size: 0.96rem;
        line-height: 1.35;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-color, #111111);
      }

      .ram-card-favorite {
        min-width: 24px;
        min-height: 24px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        color: #6c757d;
        transition: background-color 0.2s ease;
      }

      .ram-card-favorite:hover {
        background: #eef2f7;
      }

      .ram-card-favorite-icon {
        font-size: 1.3rem;
        user-select: none;
      }

      .ram-card-favorite[data-active='true'] {
        color: #ffbf2f;
      }

      .ram-card-favorite[data-active='true'] .ram-card-favorite-icon {
        font-variation-settings:
          'FILL' 1,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
      }

      .ram-card-favorite[data-active='false'] .ram-card-favorite-icon {
        font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
      }

      @keyframes ram-card-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  static properties = {
    /** @type {RamCharacter | null} */
    character: { type: Object },
    /** @type {boolean} */
    hasLoaded: { type: Boolean, state: true },
    /** @type {boolean} */
    isFavorite: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.character = null;
    this.hasLoaded = false;
    this.isFavorite = false;
    this.onLoad = this.onLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('character')) {
      this.hasLoaded = false;
      const nextId = this.character?.id;
      this.isFavorite =
        typeof nextId === 'number' && ramStore.isFavorite(nextId);
    }
  }

  updated(changedProperties) {
    if (!changedProperties.has('character')) return;

    const imageEl = this.renderRoot?.querySelector('.ram-card-image');
    if (!imageEl) return;

    // Si la imagen ya estaba cacheada, `load` puede ocurrir antes del repaint.
    if (imageEl.complete && imageEl.naturalWidth > 0) {
      this.hasLoaded = true;
    }
  }

  /**
   * @returns {string}
   */
  getImage() {
    return this.character?.image ?? '';
  }

  onLoad() {
    this.hasLoaded = true;
  }

  onImageError() {
    // Evita dejar loader infinito cuando falla la imagen.
    this.hasLoaded = true;
  }

  toggleFavorite() {
    const charId = this.character?.id;
    if (typeof charId !== 'number') return;

    this.isFavorite = ramStore.toggleFavorite(charId);
    this.dispatchEvent(
      new CustomEvent('favorite-change', {
        detail: { id: charId, isFavorite: this.isFavorite },
        bubbles: true,
        composed: true,
      }),
    );
  }

  openModal() {
    if (!this.character) return;

    this.dispatchEvent(
      new CustomEvent('open-character-modal', {
        detail: { character: this.character },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.character) {
      return html``;
    }

    return html`
      <article class="ram-card-root">
        <div class="ram-card-body">
          <div class="ram-card-image-box">
            ${when(
              !this.hasLoaded,
              () => html`
                <div class="ram-card-loader" aria-hidden="true">
                  <span class="ram-card-spinner">
                    <img
                      class="ram-card-spinner-image"
                      src=${spinnerIcon}
                      alt=""
                    />
                  </span>
                </div>
              `,
            )}

            <img
              class="ram-card-image"
              src=${this.getImage()}
              alt=${this.character?.name || 'Personaje'}
              @load=${this.onLoad}
              @error=${this.onImageError}
              @click=${this.openModal}
              style=${this.hasLoaded ? '' : 'display: none;'}
            />
          </div>

          <div class="ram-card-footer">
            <h3 class="ram-card-title" @click=${this.openModal}>
              ${this.character?.name}
            </h3>
            <button
              class="ram-card-favorite"
              data-active=${String(this.isFavorite)}
              @click=${this.toggleFavorite}
              type="button"
              aria-label="Marcar favorito"
              title="Marcar favorito"
            >
              <span class="material-symbols-outlined ram-card-favorite-icon"
                >star</span
              >
            </button>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('ram-card', RamCard);
