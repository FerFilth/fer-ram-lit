import { fixture, html, expect } from '@open-wc/testing';

import './error.js';

describe('error-page', () => {
	it('creates the component', async () => {
		const el = await fixture(html`<error-page></error-page>`);
		expect(el).to.exist;
	});

	it('renders 404 content and home link', async () => {
		const el = await fixture(html`<error-page></error-page>`);
		const text = el.shadowRoot.textContent;
		const link = el.shadowRoot.querySelector('.btn-home');

		expect(text).to.contain('404');
		expect(text).to.contain('Pagina no encontrada');
		expect(link?.getAttribute('href')).to.equal('/rick-and-morty');
	});
});
