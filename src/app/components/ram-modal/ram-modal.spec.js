import { fixture, html, expect, oneEvent } from '@open-wc/testing';

import './ram-modal.js';

const mockCharacter = {
	id: 1,
	name: 'Rick Sanchez',
	image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
	status: 'Alive',
	species: 'Human',
	type: '',
	gender: 'Male',
	origin: { name: 'Earth (C-137)', url: '' },
	location: { name: 'Citadel of Ricks', url: '' },
	episode: ['https://rickandmortyapi.com/api/episode/1'],
	url: 'https://rickandmortyapi.com/api/character/1',
	created: '2017-11-04T18:48:46.250Z',
};

describe('ram-modal', () => {
	it('creates the component', async () => {
		const el = await fixture(html`<ram-modal .character=${mockCharacter}></ram-modal>`);
		expect(el).to.exist;
	});

	it('renders character details', async () => {
		const el = await fixture(html`<ram-modal .character=${mockCharacter}></ram-modal>`);
		const text = el.shadowRoot.textContent;

		expect(text).to.contain('Rick Sanchez');
		expect(text).to.contain('Alive');
		expect(text).to.contain('Male');
		expect(text).to.contain('Human');
		expect(text).to.contain('Earth (C-137)');
		expect(text).to.contain('Citadel of Ricks');
	});

	it('renders character image', async () => {
		const el = await fixture(html`<ram-modal .character=${mockCharacter}></ram-modal>`);
		const img = el.shadowRoot.querySelector('.ram-modal-photo');

		expect(img.getAttribute('src')).to.contain('avatar/1.jpeg');
	});

	it('emits close-modal when close button is clicked', async () => {
		const el = await fixture(html`<ram-modal .character=${mockCharacter}></ram-modal>`);
		const eventPromise = oneEvent(el, 'close-modal');
		const btn = el.shadowRoot.querySelector('.ram-modal-close-btn');

		btn.click();
		await eventPromise;

		expect(el.open).to.equal(false);
	});

	it('shows image fallback on image error', async () => {
		const el = await fixture(html`<ram-modal .character=${mockCharacter}></ram-modal>`);
		el.onImageError();
		await el.updateComplete;

		const fallback = el.shadowRoot.querySelector('.ram-modal-photo-fallback');
		expect(fallback).to.exist;
	});
});
