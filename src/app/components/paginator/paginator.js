import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';

import { ramStore } from '../../services/ram.service.js';
import { shadowReset } from '../../styles/shadow-reset.js';

export class AppPaginator extends LitElement {
  static properties = {
    isLoading: { type: Boolean, attribute: 'is-loading', reflect: true },
    totalItems: {
      state: true,
    } /** Total de registros que indica la API */,
    pageSize: { state: true },
    page: { state: true },
  };

  static styles = [
    shadowReset,
    css`
      :host {
        display: block;
      }

      .ram-paginator-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        width: 100%;
      }

      .ram-paginator-wrap.is-loading {
        opacity: 0.5;
        pointer-events: none;
      }

      .ram-page-btn {
        min-width: 36px;
        height: 36px;
        padding: 0 8px;
        border: 1px solid var(--border-color, #dee2e6);
        border-radius: 6px;
        background: var(--surface-color, #ffffff);
        color: var(--text-color, #495057);
        font-size: 14px;
        cursor: pointer;
        transition:
          background-color 0.15s ease,
          color 0.15s ease,
          border-color 0.15s ease,
          transform 0.15s ease;
      }

      .ram-page-btn:hover:not(:disabled) {
        background: var(--btn-secondary-bg, #e9ecef);
        border-color: var(--btn-secondary-border, #e9ecef);
        transform: translateY(-1px);
		color: var(--text-color, #495057);
      }

      .ram-page-btn.is-active {
        background: var(--btn-primary-bg, #0d6efd);
        border-color: var(--btn-primary-border, #0d6efd);
        color: var(--btn-primary-text, #ffffff);
        font-weight: 600;
      }

      .ram-page-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none;
      }

      .ram-page-ellipsis {
        padding: 0 6px;
        color: var(--paginator-ellipsis-color, #6c757d);
        line-height: 36px;
      }
    `,
  ];

  constructor() {
    super();
    this.isLoading = false;
    this.totalItems = 0;
    this.pageSize = 20;
    this.page = 1;
    this.unsubscribe = null;

    this.onPageChange = this.onPageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = ramStore.subscribe((state) => {
      this.page = state.page;
      this.totalItems = state.collectionSize;
      this.pageSize = ramStore.PAGE_SIZE;
    });
  }

  disconnectedCallback() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }

    super.disconnectedCallback();
  }

  /**
   * @returns {number}
   */
  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  /**
   * @returns {number[]}
   */
  get visiblePages() {
    const total = this.totalPages;
    const current = this.page;
    const maxVisible = 4;
    const pages = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, current - 1); // evitar que el inicio sea menor a 2,ya que 1 siempre se muestra
    const end = Math.min(total - 1, current + 1); // evitar que el final sea mayor a total-1, ya que total siempre se muestra

    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < total - 1) pages.push(-1);

    pages.push(total);
    return pages;
  }

  /**
   * @param {number} nextPage
   */
  onPageChange(nextPage) {
    if (this.isLoading) return;
    if (nextPage < 1 || nextPage > this.totalPages) return;
    if (nextPage === this.page) return;

    ramStore.setPage(nextPage);
  }

  render() {
    return html`
      <nav
        class="ram-paginator-wrap ${this.isLoading ? 'is-loading' : ''}"
        aria-label="Paginador"
      >
        <button
          class="ram-page-btn"
          ?disabled=${this.page === 1 || this.isLoading}
          @click=${() => this.onPageChange(this.page - 1)}
          aria-label="Pagina anterior"
          type="button"
        >
          ‹
        </button>

        ${map(this.visiblePages, (p) =>
          p === -1
            ? html`<span class="ram-page-ellipsis" aria-hidden="true">…</span>`
            : html`
                <button
                  class="ram-page-btn ${p === this.page ? 'is-active' : ''}"
                  ?disabled=${this.isLoading}
                  @click=${() => this.onPageChange(p)}
                  aria-current=${p === this.page ? 'page' : 'false'}
                  type="button"
                >
                  ${p}
                </button>
              `,
        )}

        <button
          class="ram-page-btn"
          ?disabled=${this.page === this.totalPages || this.isLoading}
          @click=${() => this.onPageChange(this.page + 1)}
          aria-label="Pagina siguiente"
          type="button"
        >
          ›
        </button>
      </nav>
    `;
  }
}

customElements.define('app-paginator', AppPaginator);
