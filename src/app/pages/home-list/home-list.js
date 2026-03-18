import { LitElement, html, css } from 'lit';
import { shadowReset } from '../../styles/shadow-reset.js';
export class HomeListPage extends LitElement {
  static styles = [
    shadowReset,
    css`
      .home-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }

      .grid-home-page {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 16px;
        padding: 18px;
        height: 100%;
        overflow: hidden;
      }

      .grid-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        gap: 16px;
        overflow: hidden;
        min-height: 0;
      }

      .grid-content .action-bar {
        display: flex;
        height: 45px;
        justify-content: space-between;
        align-items: center;
      }

      .grid-scroll-container {
        overflow-y: auto;
        min-height: 0;
      }

      .section-row,
      .full-col {
        width: 100%;
      }

      .center-text {
        text-align: center;
      }

      .mb-3 {
        margin-bottom: 1rem;
      }

      .mb-2 {
        margin-bottom: 0.5rem;
      }

      .mb-0 {
        margin-bottom: 0;
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
        background-color: #0056b3;
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
        background-color: #0d6efd;
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
    `,
  ];

  //   createRenderRoot() {
  //     return this;
  //   }

  render() {
    return html`
      <main class="home-container grid-home-page">
        <!-- <section class="section-row">
            <div class="full-col">
              <h1 class="center-text mb-3">
                {{ !showOnlyFavorites ? 'Wubba lubba dub dub!' : 'Mis favoritos'
                }}
              </h1>
              <p class="mb-3 center-text">
                Base de datos de personajes de Rick y Morty
              </p>
            </div>
          </section>
          <div class="grid-content">
            <div class="action-bar">
              <app-ram-input
                (item)="onSearch($event)"
                [isLoading]="isLoading"
              ></app-ram-input>
              <div class="favorites-toolbar">
                <span
                  class=""
                  [style]="
            'font-weight: 600;
         '
          "
                  >{{ showOnlyFavorites ? 'Home' : 'Mis favoritos' }}</span
                >
                <button
                  class="favorite-button"
                  [class.favorite-active]="showOnlyFavorites"
                  [class.favorite-inactive]="!showOnlyFavorites"
                  [class.is-active]="showOnlyFavorites"
                  (click)="toggleFavorite()"
                >
                  <span class="material-symbols-outlined favorite-icon">
                    {{ showOnlyFavorites ? 'home' : 'star' }}
                  </span>
                </button>
              </div>
            </div>

            <div class="row grid-scroll-container">
              <div class="col-12">
                <div
                  *ngIf="showOnlyFavorites && characters.length === 0"
                  class="info-alert text-center mt-4"
                >
                  <span
                    class="material-symbols-outlined icon-xl blockmb-2"
                    style="font-variation-settings: 'FILL' 0"
                    >star</span
                  >
                  <p class="mb-0">
                    No tienes personajes favoritos aún. ¡Empieza a marcar tus
                    favoritos!
                  </p>
                </div>
                <app-ram-grid [characters]="characters"></app-ram-grid>
              </div>
            </div>

            <app-paginator [isLoading]="isLoading"></app-paginator>
          </div> -->
      </main>
    `;
  }
}

customElements.define('home-list', HomeListPage);
