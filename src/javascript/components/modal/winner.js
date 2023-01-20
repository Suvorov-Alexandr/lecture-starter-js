import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';
// import App from '../../app';

export function showWinnerModal(fighter) {
  // call showModal function
  const { source, name } = fighter;

  let bodyElement = createElement({ tagName: 'div', className: 'winner-box' });

  const attributes = {
    src: source,
    title: name,
    alt: name
  };

  let fighterImage = createElement({
    tagName: 'img',
    className: 'winner-image',
    attributes
  });

  bodyElement.append(fighterImage);

  function restart() {
    // App.rootElement.innerHTML = '';
    location.reload();
    // App.startApp();
  }

  showModal({
    title: `${name} is the winner!`,
    bodyElement,
    onClose: () => restart()
  });
}
