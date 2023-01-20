import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  if (!fighter) {
    return fighterElement;
  }

  let { source, name, health, attack, defense } = fighter;

  // todo: show fighter info (image, name, health, etc.)

  let fighterPreview = createElement({ tagName: 'div', className: 'fighter-preview___box' });
  fighterPreview.innerHTML = `<img src="${source}" alt="fighter" class="fighter-preview___img";>
                  <h1 class="fighter-preview___title">${name}</h1>
                  <ul class="fighter-preview___list">
                  <li class="fighter-preview___item">Health: <strong class="--strong">${health}</strong> </li>
                  <li class="fighter-preview___item">Attack: <strong class="--strong">${attack}</strong></li>
                  <li class="fighter-preview___item">Defence: <strong class="--strong">${defense}</strong></li>
                  </ul>`;

  fighterElement.append(fighterPreview);

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });

  return imgElement;
}
