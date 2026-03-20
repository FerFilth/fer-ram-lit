import { fixture, html, expect } from '@open-wc/testing';

import './ram-grid.js';

const mockCharacters = [
	{
		id: 1,
		name: 'Rick Sanchez',
		image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
	},
	{
		id: 2,
		name: 'Morty Smith',
		image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
	},
];

describe('ram-grid', () => {
	it('creates the component', async () => {
		const el = await fixture(html`<ram-grid></ram-grid>`);
		expect(el).to.exist;
	});

	it('has null characters by default', async () => {
		const el = await fixture(html`<ram-grid></ram-grid>`);
		expect(el.characters).to.equal(null);
	});

	it('renders cards when characters are provided', async () => {
		const el = await fixture(html`<ram-grid .characters=${mockCharacters}></ram-grid>`);
		const cards = el.shadowRoot.querySelectorAll('ram-card');

		expect(cards.length).to.equal(2);
	});

	it('shows empty state for empty list', async () => {
		const el = await fixture(html`<ram-grid .characters=${[]}></ram-grid>`);

		expect(el.shadowRoot.textContent).to.contain('No hay personajes disponibles');
	});

	it('shows empty state for null characters', async () => {
		const el = await fixture(html`<ram-grid></ram-grid>`);

		expect(el.shadowRoot.textContent).to.contain('No hay personajes disponibles');
	});
});
