import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
import '../ram-card/ram-card.js';

/**
 * @typedef {Object} RamCharacter
 * @property {number} id - Unique character id from the API.
 * @property {string} name - Character display name.
 */

/**
 * Responsive card grid for the Rick and Morty character collection.
 */
export class RamGrid extends LitElement {
  static styles = [
    shadowReset,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 100%;
      }

      .ram-grid-shell {
        width: 100%;
        height: 100%;
      }

      .ram-grid-cards {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 1rem;
      }

      .ram-grid-card-slot {
        width: 100%;
      }

      .ram-grid-empty-state {
        min-height: 220px;
        display: grid;
        place-items: center;
        text-align: center;
        color: var(--text-color, #111111);
      }

      .ram-grid-empty-copy {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
        opacity: 0.85;
      }

      @media (min-width: 440px) {
        .ram-grid-cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 640px) {
        .ram-grid-cards {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (min-width: 900px) {
        .ram-grid-cards {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      @media (min-width: 1200px) {
        .ram-grid-cards {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
      }
    `,
  ];

  static properties = {
    /**
     * Character list consumed by the grid.
     * @type {RamCharacter[] | null}
     */
    characters: { type: Array },
  };

  constructor() {
    super();
    /** @type {RamCharacter[] | null} */
    this.characters = null;
  }

  /**
   * @returns {boolean}
   */
  hasCharacters() {
    return Array.isArray(this.characters) && this.characters.length > 0;
  }

  render() {
    if (!this.hasCharacters()) {
      return html`
        <div class="ram-grid-shell">
          <div class="ram-grid-empty-state" role="status" aria-live="polite">
            <p class="ram-grid-empty-copy">No hay personajes disponibles</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="ram-grid-shell">
        <div class="ram-grid-cards">
          ${this.characters.map(
            (item) => html`
              <article
                class="ram-grid-card-slot"
                data-character-id="${item.id}"
              >
                <ram-card .character=${item}></ram-card>
              </article>
            `,
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('ram-grid', RamGrid);
