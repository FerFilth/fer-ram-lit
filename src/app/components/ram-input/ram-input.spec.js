import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

import './ram-input.js';

describe('ram-input', () => {
	let clock;

	beforeEach(() => {
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
		sinon.restore();
	});

	it('creates the component', async () => {
		const el = await fixture(html`<ram-input></ram-input>`);
		expect(el).to.exist;
	});

	it('emits item after debounce', async () => {
		const el = await fixture(html`<ram-input></ram-input>`);
		const input = el.shadowRoot.querySelector('#searchInput');

		const eventPromise = oneEvent(el, 'item');
		input.value = 'rick';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

		await clock.tickAsync(401);
		const event = await eventPromise;
		expect(event.detail).to.equal('rick');
	});

	it('does not emit duplicate values', async () => {
		const el = await fixture(html`<ram-input></ram-input>`);
		const input = el.shadowRoot.querySelector('#searchInput');
		const listener = sinon.spy();
		el.addEventListener('item', listener);

		input.value = 'rick';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		await clock.tickAsync(401);

		input.value = 'rick';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		await clock.tickAsync(401);

		expect(listener.calledOnce).to.equal(true);
	});

	it('disables input when loading', async () => {
		const el = await fixture(html`<ram-input .isLoading=${true}></ram-input>`);
		const input = el.shadowRoot.querySelector('#searchInput');

		expect(input.disabled).to.equal(true);
	});

	it('enables input when loading ends', async () => {
		const el = await fixture(html`<ram-input .isLoading=${true}></ram-input>`);
		el.isLoading = false;
		await el.updateComplete;

		const input = el.shadowRoot.querySelector('#searchInput');
		expect(input.disabled).to.equal(false);
	});

	it('does not emit while loading', async () => {
		const el = await fixture(html`<ram-input .isLoading=${true}></ram-input>`);
		const input = el.shadowRoot.querySelector('#searchInput');
		const listener = sinon.spy();
		el.addEventListener('item', listener);

		input.value = 'morty';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		await clock.tickAsync(401);

		expect(listener.called).to.equal(false);
	});

	it('renders the search input', async () => {
		const el = await fixture(html`<ram-input></ram-input>`);
		const input = el.shadowRoot.querySelector('input#searchInput');

		expect(input).to.exist;
	});

	it('clears debounce on disconnect', async () => {
		const el = await fixture(html`<ram-input></ram-input>`);
		const input = el.shadowRoot.querySelector('#searchInput');
		const listener = sinon.spy();
		el.addEventListener('item', listener);

		input.value = 'summer';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		el.remove();

		await clock.tickAsync(401);
		expect(listener.called).to.equal(false);
	});
});
