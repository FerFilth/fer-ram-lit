import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';

import { iconFonts } from '../../styles/icon-fonts.js';

export class RamInput extends LitElement {
  static styles = [
    shadowReset,
    iconFonts,
    css`
      :host {
        display: block;
        flex: 1;
        min-width: 0;
        max-width: 420px;
      }

      .ram-search-root {
        display: flex;
        align-items: stretch;
        width: 100%;
        border: 1px solid var(--border-color-search);
        border-radius: 0.625rem;
        background: var(--surface-color);
        overflow: hidden;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          opacity 0.2s ease,
          background-color 0.3s ease; /* Transición para cuando cambia el tema */
      }

      .ram-search-root.is-loading {
        opacity: 0.75;
      }

      .ram-search-root:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(79, 146, 255, 0.2);
      }

      .ram-search-icon-slot {
        width: 40px;
        min-width: 40px;
        display: grid;
        place-items: center;
        background: var(--bg-color);
        color: var(--text-color);
        border-right: 1px solid var(--border-color);
        transition:
          background-color 0.3s ease,
          color 0.3s ease;
      }

      .ram-search-icon {
        font-size: 1.15rem;
        line-height: 1;
      }

      .ram-search-spinner {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid var(--border-color);
        border-top-color: var(--primary-color);
        animation: ram-spin 0.75s linear infinite;
      }

      .ram-search-input {
        width: 100%;
        min-width: 0;
        border: none;
        outline: none;
        padding: 0.45rem 0.7rem;
        background: transparent;
        color: var(--text-color);
      }

      .ram-search-input::placeholder {
        color: var(--text-color);
        opacity: 0.6;
      }

      .ram-search-input:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      @keyframes ram-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  static properties = {
    /** @type {boolean} */
    isLoading: { type: Boolean, attribute: 'is-loading', reflect: true },
    /** @type {string} */
    value: { type: String },
  };

  constructor() {
    super();
    this.isLoading = false;
    this.value = '';
    this.debounceDelay = 400;
    this._debounceId = null;
    this._lastEmitted = '';
    this.onInputChange = this.onInputChange.bind(this);
  }

  disconnectedCallback() {
    this.#clearDebounce();
    super.disconnectedCallback();
  }

  /**
   * @param {InputEvent} event
   */
  onInputChange(event) {
    const nextValue = String(event.target?.value ?? '');
    this.value = nextValue;
    this.#clearDebounce();

    this._debounceId = window.setTimeout(() => {
      if (this.isLoading) return;
      if (nextValue === this._lastEmitted) return;
      this._lastEmitted = nextValue;
      this.dispatchEvent(
        new CustomEvent('item', {
          detail: nextValue,
          bubbles: true,
          composed: true,
        }),
      );
    }, this.debounceDelay);
  }

  #clearDebounce() {
    if (this._debounceId !== null) {
      clearTimeout(this._debounceId);
      this._debounceId = null;
    }
  }

  render() {
    const placeholder = this.isLoading ? 'Buscando...' : 'Busca un personaje';

    return html`
      <label class="ram-search-root ${this.isLoading ? 'is-loading' : ''}">
        <span class="ram-search-icon-slot" aria-hidden="true">
          ${this.isLoading
            ? html`<span class="ram-search-spinner"></span>`
            : html`<span class="material-symbols-outlined ram-search-icon"
                >search</span
              >`}
        </span>
        <input
          id="searchInput"
          class="ram-search-input"
          type="text"
          .value=${this.value}
          .placeholder=${placeholder}
          .disabled=${this.isLoading}
          @input=${this.onInputChange}
        />
      </label>
    `;
  }
}

customElements.define('ram-input', RamInput);
