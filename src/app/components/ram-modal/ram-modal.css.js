import { css } from 'lit';

export const ramModalStyles =  css`
      :host {
        display: contents;
      }

      .ram-modal-shell {
        width: min(92vw, 420px);
        border: 1px solid
          var(--modal-border-color, var(--border-color, #dfe3ea));
        border-radius: 12px;
        padding: 0;
        background: var(--modal-surface-bg, var(--surface-color, #ffffff));
        color: var(--modal-text-color, var(--text-color, #1f2937));
        box-shadow: var(--modal-shadow, 0 20px 48px rgba(7, 17, 32, 0.28));
      }

      .ram-modal-shell::backdrop {
        background: var(--modal-backdrop, rgba(8, 14, 25, 0.45));
        backdrop-filter: blur(2px);
      }

      .ram-modal-body {
        padding: 10px;
      }

      .ram-modal-close-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
      }

      .ram-modal-close-btn {
        border: none;
        border-radius: 10px;
        background: var(--danger-soft-bg, #ffe1e1);
        color: var(--danger-soft-text, #c73a3a);
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        transition: all 0.2s ease;
      }

      .ram-modal-close-btn:hover {
        background: var(--danger-solid-bg, #c73a3a);
        color: var(--danger-solid-text, #ffe1e1);
      }

      .ram-modal-photo {
        width: 100%;
        height: auto;
        min-height: 180px;
        max-height: 360px;
        border-radius: 10px;
        border: 1px solid var(--modal-photo-border, #d9dfe7);
        object-fit: cover;
      }

      .ram-modal-photo-fallback {
        width: 100%;
        min-height: 180px;
        max-height: 360px;
        border-radius: 4px;
        border: 1px solid var(--modal-photo-border, #d9dfe7);
        display: grid;
        place-items: center;
        background: var(
          --modal-fallback-bg,
          linear-gradient(180deg, #eef2f7 0%, #e6ebf1 100%)
        );
        color: var(--modal-fallback-text, #5b677a);
        font-size: 0.9rem;
        font-weight: 600;
      }

      .ram-modal-name {
        font-size: 14px;
        font-weight: 700;
        margin: 10px 0;
        text-align: center;
        color: var(--modal-heading-color, #111827);
      }

      .ram-modal-badge-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
      }

      .ram-modal-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        max-width: 100%;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        color: var(--badge-text-color, #1b2430);
        overflow: hidden;
        margin: 3px;
        cursor: help;
      }

      .ram-modal-badge-label {
        font-weight: 700;
        letter-spacing: normal;
        flex-shrink: 0;
      }

      .ram-modal-badge-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .ram-modal-badge--full {
        grid-column: span 2;
      }

      .ram-modal-badge--left {
        justify-self: end;
      }

      .ram-modal-badge--right {
        justify-self: start;
      }

      .ram-modal-badge--blue {
        background-color: var(--badge-blue-bg, #ccefff);
      }

      .ram-modal-badge--purple {
        background-color: var(--badge-purple-bg, #ccd5ff);
      }

      .ram-modal-badge--green {
        background-color: var(--badge-green-bg, #ccffda);
      }

      .ram-modal-badge--yellow {
        background-color: var(--badge-yellow-bg, #f7f6ce);
      }

      .ram-modal-badge--orange {
        background-color: var(--badge-orange-bg, #fae9d2);
      }

      @media (max-width: 480px) {
        .ram-modal-shell {
          width: min(95vw, 420px);
          max-height: 90svh;
        }

        .ram-modal-body {
          display: flex;
          flex-direction: column;
          max-height: calc(90svh - 2px);
          overflow: hidden;
        }

        .ram-modal-photo,
        .ram-modal-photo-fallback {
          width: min(100%, 300px);
          margin-inline: auto;
          flex-shrink: 0;
          min-height: 150px;
          max-height: 240px;
        }

        .ram-modal-name {
          flex-shrink: 0;
        }

        .ram-modal-badge-grid {
          grid-template-columns: 1fr;
          overflow-y: auto;
          flex: 1 1 auto;
          min-height: 0;
          padding-right: 2px;
          scrollbar-width: thin;
          scrollbar-color: var(--modal-border-color, #dfe3ea) transparent;
        }

        .ram-modal-badge-grid::-webkit-scrollbar {
          width: 6px;
        }

        .ram-modal-badge-grid::-webkit-scrollbar-track {
          background: transparent;
        }

        .ram-modal-badge-grid::-webkit-scrollbar-thumb {
          background: var(--modal-border-color, #dfe3ea);
          border-radius: 999px;
        }

        .ram-modal-badge--full,
        .ram-modal-badge--left,
        .ram-modal-badge--right {
          grid-column: auto;
          justify-self: center;
        }
      }
    `;