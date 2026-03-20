import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
import { iconFonts } from '../../styles/icon-fonts.js';
import { ramModalStyles } from './ram-modal.css.js';

/**
 * @typedef {Object} RamLocationInfo
 * @property {string} [name]
 *
 * @typedef {Object} RamCharacter
 * @property {number} id
 * @property {string} name
 * @property {string} image
 * @property {string} [status]
 * @property {string} [gender]
 * @property {string} [species]
 * @property {RamLocationInfo} [origin]
 * @property {RamLocationInfo} [location]
 */

export class RamModal extends LitElement {
  static properties = {
    /** @type {RamCharacter | null} */
    character: { type: Object },
    /** @type {boolean} */
    open: { type: Boolean, reflect: true },
    /** @type {boolean} */
    imageLoadError: { state: true },
  };

  static styles = [
    shadowReset,
    iconFonts,
    ramModalStyles,
  ];

  constructor() {
    super();
    this.character = null;
    this.open = false;
    this.imageLoadError = false;
    this.onCloseRequest = this.onCloseRequest.bind(this);
    this.onNativeCancel = this.onNativeCancel.bind(this);
    this.onDialogClick = this.onDialogClick.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('character')) {
      this.imageLoadError = false;
    }

    if (!changedProperties.has('open')) return;

    const dialog = this.renderRoot?.querySelector('dialog');
    if (!dialog) return;

    if (this.open && !dialog.open) {
      dialog.showModal();
    }

    if (!this.open && dialog.open) {
      dialog.close();
    }
  }

  onCloseRequest() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close-modal', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * @param {Event} event
   */
  onNativeCancel(event) {
    event.preventDefault();
    this.onCloseRequest();
  }

  /**
   * @param {MouseEvent} event
   */
  onDialogClick(event) {
    const target = event.target;
    if (target instanceof HTMLDialogElement) {
      this.onCloseRequest();
    }
  }

  onImageError() {
    this.imageLoadError = true;
  }

  onImageLoad() {
    this.imageLoadError = false;
  }

  render() {
    const imageUrl = this.character?.image ?? '';
    const shouldShowImage = Boolean(imageUrl) && !this.imageLoadError;
    const status = this.character?.status ?? '';
    const gender = this.character?.gender ?? '';
    const species = this.character?.species ?? '';
    const originName = this.character?.origin?.name ?? '';
    const locationName = this.character?.location?.name ?? '';

    return html`
      <dialog
        class="ram-modal-shell"
        @cancel=${this.onNativeCancel}
        @click=${this.onDialogClick}
      >
        <div class="ram-modal-body">
          <div class="ram-modal-close-row">
            <button
              type="button"
              class="ram-modal-close-btn"
              @click=${this.onCloseRequest}
            >
              CERRAR
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          ${shouldShowImage
            ? html`
                <img
                  class="ram-modal-photo"
                  src=${imageUrl}
                  alt=${this.character?.name ?? 'Personaje'}
                  style="height: auto;"
                  @error=${this.onImageError}
                  @load=${this.onImageLoad}
                />
              `
            : html`
                <div
                  class="ram-modal-photo-fallback"
                  role="img"
                  aria-label="Imagen no disponible"
                >
                  Imagen no disponible
                </div>
              `}

          <div class="ram-modal-name">${this.character?.name ?? ''}</div>

          <div class="ram-modal-badge-grid">
            <div
              class="ram-modal-badge ram-modal-badge--blue ram-modal-badge--left"
              title=${status}
            >
              <span class="ram-modal-badge-label">Estado:</span>
              <span class="ram-modal-badge-value">${status}</span>
            </div>
            <div
              class="ram-modal-badge ram-modal-badge--purple ram-modal-badge--right"
              title=${gender}
            >
              <span class="ram-modal-badge-label">Genero:</span>
              <span class="ram-modal-badge-value">${gender}</span>
            </div>

            <div
              class="ram-modal-badge ram-modal-badge--green ram-modal-badge--left"
              title=${species}
            >
              <span class="ram-modal-badge-label">Especie:</span>
              <span class="ram-modal-badge-value">${species}</span>
            </div>
            <div
              class="ram-modal-badge ram-modal-badge--yellow ram-modal-badge--right"
              title=${originName}
            >
              <span class="ram-modal-badge-label">Origen:</span>
              <span class="ram-modal-badge-value">${originName}</span>
            </div>
            <div
              class="ram-modal-badge ram-modal-badge--orange ram-modal-badge--full"
              title=${locationName}
            >
              <span class="ram-modal-badge-label">Ubicacion:</span>
              <span class="ram-modal-badge-value">${locationName}</span>
            </div>
          </div>
        </div>
      </dialog>
    `;
  }
}

customElements.define('ram-modal', RamModal);
