import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

import './ram-card.js';
import { ramStore } from '../../services/ram.service.js';

const mockCharacter = {
	id: 1,
	name: 'Rick Sanchez',
	image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
	status: 'Alive',
	species: 'Human',
	type: '',
	gender: 'Male',
	origin: { name: 'Earth', url: '' },
	location: { name: 'Earth', url: '' },
	episode: ['https://rickandmortyapi.com/api/episode/1'],
	url: 'https://rickandmortyapi.com/api/character/1',
	created: '2017-11-04T18:48:46.250Z',
};

describe('ram-card', () => {
	beforeEach(() => {
		sinon.stub(ramStore, 'isFavorite').returns(false);
		sinon.stub(ramStore, 'toggleFavorite').returns(true);
	});

	afterEach(() => {
		sinon.restore();
	});

	it('creates the component', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);
		expect(el).to.exist;
	});

	it('checks favorite status when character changes', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);

		expect(ramStore.isFavorite.calledOnceWithExactly(1)).to.equal(true);
		expect(el.isFavorite).to.equal(false);
	});

	it('returns character image', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);
		expect(el.getImage()).to.equal(mockCharacter.image);
	});

	it('updates hasLoaded on image load', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);
		expect(el.hasLoaded).to.equal(false);
		el.onLoad();
		expect(el.hasLoaded).to.equal(true);
	});

	it('toggles favorite and emits favorite-change event', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);

		const eventPromise = oneEvent(el, 'favorite-change');
		el.toggleFavorite();
		const event = await eventPromise;

		expect(ramStore.toggleFavorite.calledOnceWithExactly(1)).to.equal(true);
		expect(el.isFavorite).to.equal(true);
		expect(event.detail).to.deep.equal({ id: 1, isFavorite: true });
	});

	it('opens modal and emits open-character-modal event', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);

		const eventPromise = oneEvent(el, 'open-character-modal');
		el.openModal();
		const event = await eventPromise;

		expect(event.detail.character.name).to.equal('Rick Sanchez');
	});

	it('does nothing when character is null', async () => {
		const el = await fixture(html`<ram-card></ram-card>`);
		el.toggleFavorite();

		expect(ramStore.toggleFavorite.called).to.equal(false);
	});

	it('renders character name', async () => {
		const el = await fixture(html`<ram-card .character=${mockCharacter}></ram-card>`);
		const title = el.shadowRoot.querySelector('.ram-card-title');

		expect(title?.textContent).to.contain('Rick Sanchez');
	});
});
