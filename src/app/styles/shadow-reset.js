import { css } from 'lit';

export const shadowReset = css`
  /* Box sizing global en el shadow DOM */
  :host,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    font-family: var(
      --font-family-base,
      'Roboto',
    );
  }

  /* Quitar márgenes y paddings por defecto en elementos comunes */
  h1, h2, h3, h4, h5, h6, 
  p, figure, blockquote, dl, dd {
    margin: 0;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none; 
  }

  /* Evitar que imágenes desborden sus contenedores y forzar comportamiento inline correcto */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* Heredar tipografía en inputs/botones */
  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  /* Limpiar estilos por defecto en botones */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    box-shadow: none;
  }

  button:focus,
  button:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

